var express = require('express');
var router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const School = require('../models/School');
const multer = require('multer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dashboard' });
});

router.get('/current_user',(req,res,next)=>{
  if(req.session.user_session){
    res.json({status:1,message:req.session.user_session});
  }else{
    res.json({status:0,message:0});
  }
})

router.get('/register_student',(req,res,next) => {
  res.render('dashboard/register_student',{ title: 'Admission Form'});
})
router.get('/register_parent',(req,res,next) => {
  res.render('dashboard/register_parent',{ title: 'New Parent'});
})
router.get('/pay_tuition',(req,res,next) => {
  res.render('dashboard/pay_tuition',{ title: 'Pay Tuition'});
})
router.get('/add_subject',(req,res,next) => {
  res.render('dashboard/add_subject',{ title: 'Add Subject'});
})

router.get('/is_logged_in',(req,res,next) => {
  if(req.session.user_session == undefined){
    res.json({status:1,message:false});
  }else{
    res.json({status:1,message:false});
  }
})

// login endppoint

router.post('/login',(req,res,next)=>{
  
  if(req.body.email == undefined||req.body.password == undefined){
    res.json({status:0,message:"Sorry, One or more credentials missing"});
  }
  // console.log(req.body)
    let email = req.body.email;
    let password = req.body.password;
    // // console.log(password);
    School.findOne({email:email,password:password},(err,school)=>{
      if(err){
        res.json({status:0,message:"Sorry,Unable to login"});
      }
      if(!school){
        res.json({status:0,message:"Sorry,Invalid Email or Password"});
      }else{
        //set school session
        req.session.user_session = school._id;
        res.json({status:1,message:school});
      }
    })
});

router.post('/school',(req,res,next)=>{
  // check if all required fields are sent
  // if(req.files)/
  if(req.body){
    if(req.body.name == undefined || req.body.address == undefined||req.body.email == undefined||req.body.password == undefined||req.body.phone == undefined || req.file == undefined){
      res.json({status:0,message:"Sorry, One or more credentials missing"});
    }else{
      School.save((err,school)=>{
        if(err){
          res.json({status:0,message:"Sorry,Unable to register new Scholl"});
        }else{
          res.json({status:1,message:school});
        }
      }) 
    }
  }else{
    res.json({status:0,message:"Sorry, request body is empty"});
  }
});



module.exports = router;
