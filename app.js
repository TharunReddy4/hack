const express= require('express');
const app=express();
const dotenv=require('dotenv');
const mongoose= require('mongoose');
dotenv.config({path:'./config.env'});


app.use(express.urlencoded({extended:true}));
app.use(express.json());

const DB= process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{}).then(con=>{  
    console.log('Database connection successful')
});

const stockSchema= new mongoose.Schema({
    stockName:{
        type:String,
    },
    orderType:{
        type:String,
    },
    price:{
        type:Number,
    },
    quantity:{
        type:Number
    },
    date:{
        type:Date
    }
});

const Stock= mongoose.model('Stock',stockSchema);

app.get('/',(req,res)=>{
    res.send('hello from the server');
})

app.post('/customerData',(req,res)=>{
    const obj=req.body;
    const newData=new Stock(obj);
    newData.save().then((doc)=>{
        res.status(200).json({
            status:'success'
        })
    }).catch(err=>{
        console.log('there is an error');
        res.status(403).json({
            status:'error',
            message:'coudl not post data'
        })
    });
     
})

app.get('/showOrders',(req,res)=>{
    
    const fromDate=req.body.fromDate;
    const toDate=req.body.toDate;
    const stock=req.body.stock;
    console.log(fromDate);
    Stock
    .find({
          $and:[
              {date:fromDate},
            //   {date:{$lte:toDate}},
            //   {stockName:stock}
          ]
      } )
      .sort({ date: 1 })
      .then((items)=>{
          console.log(items)
          res.status(200).json({
              status:200,
              data:{
                  stocks:items
              }
          })
      })
      .catch((err)=>{
          console.log(err);
          res.status(403).json({
              status:'fail',
              message:'could not find'
          })
      })
})



const port=3000;
app.listen(port,()=>{
    console.log('server is running on port 3000');
})