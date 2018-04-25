var express = require('express');
var router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const School = require('../models/School');
const multer = require('multer');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt-nodejs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage })


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


router.get('/login',(req,res,next) =>{
  res.render('login',{title:'Login'});
});



router.get('/register',(req,res,next) =>{
  res.render('register',{title:'Register'});
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
    let password =bcrypt.hashSync(req.body.password);
    // // console.log(password);
    School.findOne({email:email,password:password},(err,school)=>{
      if(err){
        res.json({status:0,message:"Sorry,Unable to login"});
      }
      if(!school){
        res.json({status:0,message:"Sorry,Invalid Email or Password"});
      }else{
        //set school session
        req.session.user_session = school;
        res.json({status:1,message:school});
      }
    });
});

// register new school
router.post('/register',(req,res,next)=>{
  // check if all required fields are sent
  // if(req.files)/
  console.log(req.body)
  if(req.body){
    if(req.body.name == undefined || req.body.address == undefined||req.body.email == undefined||req.body.password == undefined||req.body.phone == undefined || req.file == undefined){
      res.json({status:0,message:"Sorry, One or more credentials missing"});
    }else{
      upload.single('photo',(err,photo)=>{
        if(err){
          res.json({status:0,message:"Sorry,Unable to upload photo"});
        }else{
          const newSchool = {
            name: req.body.name,
            address: req.body.address,
            email:req.body.email,
            password: bcrypt.hashSync(req.body.password),
            phone: req.body.phone
          }
          School.save(newSchool,(err,school)=>{
            if(err){
              res.json({status:0,message:"Sorry,Unable to register new Scholl"});
            }else{
              res.json({status:1,message:school});
            }
          }) 
        }
      })
    }
  }else{
    res.json({status:0,message:"Sorry, request body is empty"});
  }
});





module.exports = router;
