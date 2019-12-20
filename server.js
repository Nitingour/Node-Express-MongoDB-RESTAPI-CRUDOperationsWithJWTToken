const express=require('express');
const app=express();
const bodyParser=require('body-parser');

const port=process.env.PORT || 5000
app.listen(port,()=>{
console.log("Server Started on Port:"+port);
})


//configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));


const empcontroller=require('./controllers/EmpController')
app.use('/api',empcontroller);
