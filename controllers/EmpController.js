
const express=require('express')
var router=express.Router()

var mongoose=require('mongoose');
var Employee=require('../models/EmployeeModel')

const url="mongodb://localhost:27017/EMSDB";
mongoose.connect(url);


router.get('/getemp',(request,response)=>{
  var eid=request.query.empid
  console.log(eid);
Employee.find({eid},(err,result)=>{
if(err)
response.send({'err':err})
else if(result.length!=0){
console.log(result);
response.send(result[0]);
}
else {
  response.send({'err':'No records founds'})
}
    })
})

router.delete('/deleteemp',(request,response)=>{
  var eid=request.query.empid
  Employee.deleteOne({eid},(err,result)=>{
    if(err)
    response.send({'err':err})
   else{
   console.log(result);
  response.send(result);
       }
    })
})

router.post('/newemp',(request,response)=>{
var eid=request.body.eid;
var ename=request.body.ename;
var salary=request.body.salary;
     console.log(eid);
     console.log(ename);
     console.log(salary);
    var newEmp=new Employee({
        eid:eid,
        ename:ename,
        salary:salary
      });

newEmp.save(function (err, result) {
  console.log(result);
      if (err)
      response.json({msg:'Data Not Inserted',description:err})
      else if(result.eid!=undefined)
      response.json({msg:'Data Inserted'})
      else
     response.json({msg:'Data NOT Inserted'})
    });
});



router.put('/updateemp',(request,response)=>{
var eid=request.body.eid;
var ename=request.body.ename;
var salary=request.body.salary;
     console.log(eid);
     console.log(ename);
     console.log(salary);
  Employee.updateOne({eid:eid},{ename:ename,salary:salary},(err, result)=>
   {
      if (err)
      response.json({msg:'Data Not Updated',description:err})
      else
      response.json({msg:'Data Updated'})
    });
});


var Login=require('../models/LoginModel')
// router.get("/logininsert",(req,res)=>{
//   var newLogin=new Login({
//       userid:'admin',
//       password:'admin123'
//     });
//
// newLogin.save(function (err, result) {
// console.log(result);
//       }
// )
// })

const jwt=require('jsonwebtoken');

router.post("/logincheck",(request,response)=>{
var uid=request.body.uid;
var pass=request.body.pass;
var user={
  uid:uid,
  pass:pass
}
Login.find({userid:uid,password:pass},(err,result)=>{
if(err)
response.json({'err1':err})
else if (result.length!=0)
{
jwt.sign({user:user},'secretkey',{expiresIn:'100s'},(err,token)=>{
  if(err) throw err
  //response.json({'err2':err})
  else
  response.json({'msg':'Login Success',token:token})
})
}
else
response.json({'msg':'Login Fail'})
})
})


router.get('/getemps',verifyToken,(request,response)=>{

  jwt.verify(request.token, 'secretkey', (err, authData) => {
       if(err) {
         response.json({'err':err});
         }else {
           Employee.find({},(err,result)=>{
             console.log(result);
             result['user']=authData;
           response.json(result);
               })

                }
        });
})



// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.json({msg:'Please provide valid token'});
  }
}



//
// router.post('/login', (req, res) => {
//
//
//
//   const user = {
//     username: 'admin',
//     email: 'admin@gmail.com'
//     }
//  jwt.sign({user:user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
//     if(err) throw err;
//     res.json({
//       msg:'Login Success',
//       token:token
//
//     });
//   });
// });













module.exports=router
