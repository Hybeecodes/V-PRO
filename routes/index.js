var express = require('express');
var router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const School = require('../models/School');
const multer = require('multer');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const Student = require('../models/Student');
const Parent = require('../models/parent');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');

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
  console.log(req.body);
  if(req.body.email == undefined||req.body.password == undefined){
    res.json({status:0,message:"Sorry, One or more credentials missing"});
    return;
  }
  // console.log(req.body)
    let email = req.body.email;
    School.findOne({email:email},(err,school)=>{
      if(err){
        res.json({status:0,message:"Sorry,Unable to login"});
      }
      if(!school){
        res.json({status:0,message:"Sorry,Invalid Email or Password"});
      }else{
        if(bcrypt.compareSync(req.body.password,school.password)){
          //set school session
          req.session.user_session = school;
          res.json({status:1,message:school});
        }else{
        res.json({status:0,message:"Sorry,Invalid Email or Password"});
          
        }
      }
    });
});

// register new school
router.post('/register',(req,res,next)=>{
  // check if all required fields are sent
  // if(req.files)/
  console.log(req.body)
  if(req.body){
    if(req.body.name == undefined || req.body.address == undefined||req.body.email == undefined||req.body.password == undefined||req.body.phone == undefined){
      res.json({status:0,message:"Sorry, One or more credentials missing"});
    }else{
      if(req.file){
        upload.single('photo',(err,photo)=>{
          if(err){
            res.json({status:0,message:"Sorry,Unable to upload photo"});
          }else{
            const newSchool = {
              name: req.body.name,
              address: req.body.address,
              email:req.body.email,
              password: bcrypt.hashSync(req.body.password),
              phone: req.body.phone,
              created_at: Date.now()
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
      }else{
        // console.log(Date.now());
        const newSchool = {
          name: req.body.name,
          address: req.body.address,
          email:req.body.email,
          password: bcrypt.hashSync(req.body.password),
          phone: req.body.phone,
          created_at: Date.now()
        }
        
        School.create(newSchool,(err,school)=>{
          if(err){
            res.json({status:0,message:err});
          }else{
            res.json({status:1,message:school});
          }
        }) 
      }
      
    }
  }else{
    res.json({status:0,message:"Sorry, request body is empty"});
  }
});

// add new class
router.post('/add_class',(req,res,next)=>{
  if(req.body.name ==undefined || req.body.school == undefined){
    res.json({status:0,message:"Sorry, One or more credentials missing"});
  }else{
    if(req.body.nickname){
      var nickname = req.body.nickname;
    }else{
      var nickname = "";
    }
    const newClass = new Class({
      name:req.body.name,
      nickname: nickname,
      school_id: req.body.school
    });
    Class.create(newClass,(err,cls)=>{
      if(err){
        res.json({status:0,message:"Sorry,Unable to add Student"});
      }else{
        res.json({status:1,message:cls});
      }
    })
  }
});

// update tuition for class
router.post('/update_class_tuition',(req,res,next)=>{
  if(req.body.class == undefined || req.body.school == undefined || req.body.tuitions == undefined){
    res.json({status:0,message:"Sorry, One or more credentials missing"});
  }else{
    Class.findOneAndUpdate({class_id:req.body.class}, {$set:{tuition:JSON.stringify(req.body.tuitions)}}, {new:true},(err,cls)=>{
      if(err){
        res.json({status:0,message:"Sorry, Unable to update class tuition"});
      }else{
        res.json({status:1,message:cls});
      }
    });
  }
})

// 


// add new teacher
router.post('/add_teacher',(req,res,next)=>{
  if(req.body.name == undefined || req.body.gender == undefined || req.body.address ==undefined || req.body.email == undefined || req.body.phone || req.body.school ==undefined){
    res.json({status:0,message:"Sorry, One or more credentials missing"});
  }else{
    // check if teacher exists already
    Teacher.findOne({email:req.body.email,school_id:req.body.school},(err,teacher)=>{
      if(err){
         res.json({status:0,message:"Sorry, An Error Occured"});
      }else{
        if(student){
          res.json({status:0,message:"Sorry, Teacher Exists Already"});
        }else{
          const newTeacher = new Teacher({
            name:req.body.name,
            gender: req.body.gender,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            school_id: req.body.school
          });
          Teacher.create(newTeacher,(err,teacher)=>{
            if(err){
              res.json({status:0,message:"Sorry, Unable to Add New Teacher"});
            }else{
              res.json({status:1,message:teacher});
            }
          });
        }
      }
    })
  }
})

//add new tuition payment
router.post('/pay_tuition',(req,res,next)=>{
  if(req.body.school == undefined || req.body.student ==undefined || req.body.session == undefined || req.body.amount == undefined || req.body.staff_role == undefined || req.body.staff_id == undefined){
     res.json({status:0,message:"Sorry, One or more credentials missing"});
  }else{
    
  }
})
// add new student
router.post('/register_student',(req,res,next)=>{
  if(req.body.name == undefined || req.body.address == undefined||req.body.email == undefined||req.body.gender == undefined||req.body.phone == undefined || req.body.parent == undefined ||req.body.school == undefined || req.body.class == undefined ){
    res.json({status:0,message:"Sorry, One or more credentials missing"});
  }else{
    // check if student exists
    Student.findOne({email:req.body.email,parent_id:req.body.parent,school_id:req.body.school},(err,student)=>{
      if(err){
        res.json({status:0,message:"Sorry,An Error Occured"});
      }else if(student){
        res.json({status:0,message:"Sorry,Student Exists Already"});
      }else if(!student){
          // create  new student document
          const newStudent = new Student({
            name: req.body.name,
            school_id: req.body.school,
            parent_id: req.body.parent,
            class_id: req.body.class,
            gender: req.body.gender,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email
          });
          Student.create(newStudent,(err,student)=>{
            if(err){
              res.json({status:0,message:"Sorry,Unable to add Student"});
            }else{
              res.json({status:1,message:student});
            }
          })
      }
    })
  }
});

// add new parent
router.post('/register_parent',(req,res,next)=>{
  if(req.body.name == undefined || req.body.address == undefined||req.body.email == undefined||req.body.gender == undefined||req.body.phone == undefined ||req.body.school == undefined || req.body.profession == undefined ){
    res.json({status:0,message:"Sorry, One or more credentials missing"});
  }else{
    // check if student exists
    Parent.findOne({email:req.body.email,school_id:req.body.school_id},(err,parent)=>{
      if(err){
        res.json({status:0,message:"Sorry,An Error Occured"});
      }else if(parent){
        res.json({status:0,message:"Sorry,Parent Exists Already"});
      }else if(!parent){
          // create  new student document
          const newParent = new Parent({
            name: req.body.name,
            school_id: req.body.school,
            profession: req.body.profession,
            gender: req.body.gender,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email
          });
          Parent.create(newParent,(err,parent)=>{
            if(err){
              res.json({status:0,message:err});
            }else{
              res.json({status:1,message:parent});
            }
          })
      }
    })
  }
});




module.exports = router;
