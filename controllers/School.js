Student = require('../models/Student');
      Parent = require('../models/parent');
      Payment = require('../models/Payment');
      Class = require('../models/Class');
      Teacher = require('../models/Teacher');
      Session = require('../models/Session');
class SchoolController {
       
     constructor() {
        this.Session = Session;
    }

    get_school_sessions(school_id) {
        this.Session.find({school_id:school_id},(err,school)=>{
           return new Promise((resolve, reject) => {
               if(err){
                   reject(err);
               }else{
                   resolve(school);
               }
           });
        });
    };

}

  schoolCtrl = new SchoolController()
module.exports = schoolCtrl;