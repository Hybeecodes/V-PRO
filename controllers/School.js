
Student = require('../models/Student');
Parent = require('../models/parent');
Payment = require('../models/Payment');
Class = require('../models/Class');
Teacher = require('../models/Teacher');
Session = require('../models/Session');


module.exports.get_students = function(school_id){
    
    Student.count({school_id: school_id},(err,students)=>{
        if(err){
            throw err;
        }
        return students;
    });
};



