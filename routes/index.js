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
const Payment = require('../models/Payment');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const Session = require('../models/Session');
const axios = require('axios');
const schoolCtrl = require('../controllers/School');
// const EnsureLoggedIn = require('../middlewares/ensureLoggedIn').EnsureLoggedIn()




const EnsureLoggedIn = function(req, res, next) {
    // check if user is logged in
    if (!req.session.user_session) {
        res.redirect(301, '/login');
    } else {
        next();
    }
};

// router.use(EnsureLoggedIn);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  });
  var upload = multer({ storage: storage })


/* GET home page. */
router.get('/', EnsureLoggedIn, function(req, res, next) {
    var school = req.session.user_session;
    var school_id = req.session.user_session._id;
    Student.count({ school_id: school_id }, (err, student) => {
        if (err)
            throw err
        Parent.count({ school_id: school_id }, (err, parent) => {
            if (err) throw err;
            Teacher.count({ school_id: school_id }, (err, teacher) => {
                if (err) throw err;
                res.render('dashboard/index', { title: 'Dashboard', students: student,school:school, parents: parent, teachers: teacher });
            })

        })

    })

});

router.get('/current_user', (req, res, next) => {
    if (req.session.user_session) {
        res.json({ status: 1, message: req.session.user_session });
    } else {
        res.json({ status: 0, message: 0 });
    }
});

router.get('/all_parents', EnsureLoggedIn, function(req, res, next) {
    // get logged in school id from session
    var school = req.session.user_session;
    var school_id = req.session.user_session._id;
    // fetch all parents
    Parent.find({ school_id: school_id }, (err, parent) => {
        if (err) {
            throw err;
        }
        if (parent) {
            // console.log(parent);
            res.render('dashboard/parents', { title: 'Parents', parents: parent, school: school });
        }
    })
})

router.get('/add_parent', EnsureLoggedIn, (req, res, next) => {
    var school = req.session.user_session;
    const error = req.session.error;
    req.session.error = null;
    res.render('dashboard/add_parent', { title: 'Add Parent', school_id: req.session.user_session._id, error: error, school:school });
})

router.get('/login', (req, res, next) => {
    console.log(req.session);
    const error = req.session.error;
    req.session.error = null;
    res.render('login', { title: 'Login', success: req.session.success, error: error });
});

router.get('/register', (req, res, next) => {
    // console.log(req.session);
    const error = req.session.error;
    req.session.error = null;
    res.render('register', { title: 'Register', success: req.session.success, error: error });
})

router.get('/students', EnsureLoggedIn, (req, res, next) => {
    var school = req.session.user_session;
    var school_id = req.session.user_session._id;
    Student.find({ school_id: school_id }, (err, students) => {
        if (err) throw err;
        res.render('dashboard/students', { title: 'Students', students: students, school,school });
    })
})

router.get('/register_student', EnsureLoggedIn, (req, res, next) => {
    var school = req.session.user_session;
        var school_id = req.session.user_session._id;
        const error = req.session.error;
        req.session.error = null;
        // fetch all parents
        Parent.find({ school_id: school_id }, (err, parents) => {
            if (err) throw err;
            // fetch classes
            Class.find({ school_id: school_id }, (err, classes) => {
                res.render('dashboard/register_student', { title: 'New Student', classes: classes, parents: parents, school_id: school_id, error: error, school:school });
            })
        })

    })
    // router.get('/register_parent',(req,res,next) => {
    //   res.render('dashboard/register_parent',{ title: 'New Parent'});
    // })
router.get('/pay_tuition', (req, res, next) => {
    res.render('dashboard/pay_tuition', { title: 'Pay Tuition' });
})
router.get('/add_subject', (req, res, next) => {
    res.render('dashboard/add_subject', { title: 'Add Subject' });
})

router.get('/is_logged_in', (req, res, next) => {
    if (req.session.user_session == undefined) {
        res.json({ status: 1, message: false });
    } else {
        res.json({ status: 1, message: false });
    }
});

// get all school sessions
// router.get('/get_sessions/:school_id',(req,res,next)=>{
//   // console.log(req.query);
//   // console.log(req.params);
//   const school_id = req.params.school_id;
//   console.log(schoolCtrl.get_school_sessions(school_id)
// });





// get all teachers
router.get('/add_teacher', EnsureLoggedIn, (req, res, next) => {
    var school = req.session.user_session;
    const error = req.session.error;
    req.session.error = null;
    res.render('dashboard/add_teacher', { title: 'Add Teacher', school_id: req.session.user_session._id, error: error, school:school });
})

router.get('/all_teachers', EnsureLoggedIn, function(req, res, next) {
    // get logged in school id from session
    var school = req.session.user_session;
    var school_id = req.session.user_session._id;
    // fetch all parents
    Teacher.find({ school_id: school_id }, (err, teachers) => {
        if (err) {
            throw err;
        }
        if (teachers) {
            // console.log(parent);
            res.render('dashboard/teachers', { title: 'Teachers', teachers: teachers, school: school });
        }
    });
});
// router.get('/get_teachers/:school_id',EnsureLoggedIn, (req, res) => {
//     var school = req.session.user_session;
//     const school_id = req.params.school_id;
//     Teacher.find({ school_id: school_id }, (err, teacher) => {
//         if (err) {
//             res.json({ status: 0, message: "Sorry, Unable to get Teachers" });
//         } else {
//             res.json({ status: 1, message: teacher });
//         }
//     })
// });

router.get('/add_class', EnsureLoggedIn, (req, res, next) => {
    var school = req.session.user_session;
    const error = req.session.error;
    req.session.error = null;
    res.render('dashboard/add_class', { title: 'Add Class', school_id: req.session.user_session._id, error: error, school:school });
})

router.get('/all_classes', EnsureLoggedIn, function(req, res, next) {
    // get logged in school id from session
    var school = req.session.user_session;
    var school_id = req.session.user_session._id;
    // fetch all parents
    Class.find({ school_id: school_id }, (err, cls) => {
        if (err) {
            throw err;
        }
        if (cls) {
            // console.log(parent);
            res.render('dashboard/classes', { title: 'Classes', classes: cls, school: school });
        }
    })
})

// get all pareents
router.get('/get_parents/:school_id',EnsureLoggedIn, (req, res) => {
    var school = req.session.user_session;
    const school_id = req.params.school_id;
    Teacher.find({ school_id: school_id }, (err, teacher) => {
        if (err) {
            res.json({ status: 0, message: "Sorry, Unable to get Teachers" });
        } else {
            res.json({ status: 1, message: teacher });
        }
    })
});






///////////////////////POST ENDPOINTS //////////////////////////////////////
// login endpoint

router.post('/login', (req, res, next) => {
    if (req.body.email == undefined || req.body.password == undefined) {
        req.session.error = "Please Fill All Fields";
        req.session.success = false;
        // console.log('sorry')
        res.redirect('/login');
    }
    let email = req.body.email;
    School.findOne({ email: email }, (err, school) => {
        if (err) {
            req.session.error = "Sorry, Unable to log in";
            req.session.success = false;
            res.redirect('/login');
        }
        if (!school) {
            req.session.error = "Invalid Email or Password";
            req.session.success = false;
            res.redirect('/login');
        } else {
            if (bcrypt.compareSync(req.body.password, school.password)) {
                //set school session
                req.session.user_session = school;
                res.redirect('/');
            } else {
                req.session.error = "Invalid Email or Password";
                req.session.success = false;
                res.redirect('/login');
            }
        }
    });
});

// logout route
router.get('/logout', (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
})

// register new school1
router.post('/register',upload.single('photo'), (req, res, next) => {
    // check if all required fields are sent
    // if(req.body)/
    if (req.body) {
        if (req.body.name == undefined || req.body.address == undefined || req.body.email == undefined || req.body.password == undefined || req.body.phone == undefined) {
            req.session.error = "Please Fill All Fields";
            res.redirect('/register');
        } else {
                        const newSchool = {
                            name: req.body.name,
                            address: req.body.address,
                            email: req.body.email,
                            password: bcrypt.hashSync(req.body.password),
                            phone: req.body.phone,
                            created_at: Date.now(),
                            photo: req.file
                        }
                        School.create(newSchool, (err, school) => {
                            if (err) {
                                req.session.error = "Sorry, Unable to Register School";
                                res.redirect('/register');
                            } else {
                                var year = new Date().getFullYear();
                                var session = `${year}/${year+1}`;
                                console.log(session)
                                Session.create({ school_id: school._id, name: session }, (err, session) => {
                                    if (err) {
                                        throw err;
                                        return;
                                    }
                                    res.redirect('/login');
                                })
                            }
                        })
            
        }
    } else {
        req.session.error = "Please Fill All Fields";
        res.redirect('/register');
    }
});

// add new class
router.post('/add_class', (req, res, next) => {
    if (req.body.name == undefined || req.body.school == undefined) {
        req.session.error = "Please Fill All Fields";
        res.redirect('/add_class');
    } else {
        if (req.body.nickname) {
            var nickname = req.body.nickname;
        } else {
            var nickname = "";
        }
        const newClass = new Class({
            name: req.body.name,
            nickname: nickname,
            school_id: req.body.school
        });
        Class.create(newClass, (err, cls) => {
            if (err) {
                req.session.error = "Sorry, Unable to Add Class";
                res.redirect('/add_class');
            } else {
                res.redirect('/all_classes');
            }
        })
    }
});

// assign tuition to class
router.get('/assign_class_tuition',EnsureLoggedIn,(req,res,next)=>{
    var school = req.session.user_session;
    var error =  req.session.error;
    // fetch classes
    Class.find({school_id: school._id},(err,classes)=>{
        if(err){
            res.redirect('/');
        }else{
            res.render('dashboard/assign_class_tuition',{title:'Assign Class Tuitions',error:error,school:school,classes:classes});
        }
    });
   
});

router.get('/class_tuitions',EnsureLoggedIn,(req,res,next)=>{
    var school = req.session.user_session;

    // fetch classes
    Class.find({school_id:school.school_id},(err,classes)=>{
        if(err){
            res.redirect('/');
        }else{
            res.render('dashboard/class_tuitions',{title:'Class Tuitions',school:school, classes:classes});
        }
    })
})



// update tuition for class
router.post('/update_class_tuition', (req, res, next) => {
    if (req.body.class == undefined || req.body.school == undefined || req.body.tuitions == undefined) {
        req.session.error = "Please Fill all Fields";
        res.redirect('/assign_class_tuition');
    } else {
        Class.findOneAndUpdate({ class_id: req.body.class, school_id: req.body.school }, { $set: { tuition1:req.body.tuition1, tuition2: req.body.tuition2, tuition3: req.body.tuition3  } }, { new: true }, (err, cls) => {
            if (err) {
                req.session.error = "Sorry, Unable to Assign Tuition";
                res.redirect('/assign_class_tuition');
            } else {
                res.redirect('/class_tuitions');
            }
        });
    }
})

// 


// add new teacher
router.post('/add_teacher', (req, res, next) => {
    // console.log(req.body);
        // check if teacher exists already
        Teacher.findOne({ email: req.body.email, school_id: req.body.school }, (err, teacher) => {
            if (err) {
                req.session.error = "Sorry, An error Occured";
                res.redirect('/add_teacher');
            } else {
                if (teacher) {
                    req.session.error = "Sorry, Teacher Already Exists";
                    res.redirect('/add_teacher');
                } else {
                    const newTeacher = new Teacher({
                        name: req.body.name,
                        gender: req.body.gender,
                        address: req.body.address,
                        phone: req.body.phone,
                        email: req.body.email,
                        school_id: req.body.school
                    });
                    Teacher.create(newTeacher, (err, teacher) => {
                        if (err) {
                            console.log(err);
                            req.session.error = "Sorry, Unable to add Teachers";
                            res.redirect('/add_teacher');
                        } else {
                            res.redirect('all_teachers');
                        }
                    });
                }
            }
        })
})


//add new tuition payment
router.post('/pay_tuition', (req, res, next) => {
        if (req.body.school_id == undefined || req.body.student_id == undefined || req.body.session_id == undefined || req.body.amount == undefined || req.body.staff_role == undefined) {
            res.json({ status: 0, message: "Sorry, One or more credentials missing" });
        } else {
            const newPayment = req.body;
            Payment.create(newPayment, (err, payment) => {
                if (err) {
                    res.json({ status: 0, message: "Sorry, Unable to Add New Tuition" });
                } else {
                    res.json({ status: 1, message: payment });
                }
            })
        }
    })
    // add new student
router.post('/register_student', (req, res, next) => {
    if (req.body.name == undefined || req.body.address == undefined || req.body.email == undefined || req.body.gender == undefined || req.body.phone == undefined || req.body.parent == undefined || req.body.school == undefined || req.body.class == undefined) {
        req.session.error = "Please Fill All Fields";
        res.redirect('/register_student');
    } else {
        // check if student exists
        Student.findOne({ email: req.body.email, parent_id: req.body.parent, school_id: req.body.school }, (err, student) => {
            if (err) {
                req.session.error = "Sorry, An error occured";
                res.redirect('/register_student');
            } else if (student) {
                req.session.error = "Sorry,Student Exists Already";
                res.redirect('/register_student');
            } else if (!student) {
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
                Student.create(newStudent, (err, student) => {
                    if (err) {
                        req.session.error = "Sorry,Unable to add Student";
                        res.redirect('/register_student');
                    } else {
                        res.redirect('/students');
                    }
                })
            }
        })
    }
});

// add new parent
router.post('/add_parent', (req, res, next) => {
    if (req.body.name == undefined || req.body.address == undefined || req.body.email == undefined || req.body.gender == undefined || req.body.phone == undefined || req.body.school == undefined || req.body.profession == undefined) {
        req.session.error = "Please Fill All Fields";
        res.redirect('/add_parent');
    } else {
        // check if student exists
        Parent.findOne({ email: req.body.email, school_id: req.body.school_id }, (err, parent) => {
            if (err) {
                req.session.error = "Sorry,An Error Occured";
                res.redirect('/add_parent');
            } else if (parent) {
                req.session.error = "Sorry,Parent Exists Already";
                res.redirect('/add_parent');
            } else if (!parent) {
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
                Parent.create(newParent, (err, parent) => {
                    if (err) {
                        req.session.error = "Sorry,Unable to Add New Parent";
                        res.redirect('/add_parent');
                    } else {
                        res.redirect('/all_parents');
                    }
                })
            }
        })
    }
});




module.exports = router;