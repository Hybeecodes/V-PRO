
Student = require('../models/Student');
Parent = require('../models/parent');
Payment = require('../models/Payment');
Class = require('../models/Class');
Teacher = require('../models/Teacher');
Session = require('../models/Session');


module.exports.get_students = function(req,res,next){
    return Student.find({school_id: req.Session.user_session._id},(err,student));
};



