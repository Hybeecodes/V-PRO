var express = require('express');
var router = express.Router();
const Student = require('../models/Student');
const Parent = require('../models/parent');
const Payment = require('../models/Payment');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const Session = require('../models/Session');


module.exports.getStudents =function(school_id){
 return new Promise((resolve,reject)=>{
    Student.find({school_id:school_id},(err,students)=>{
        if(err){
            reject(new Error(err))
        }else{
            resolve(students);
        }
    })
})
}



