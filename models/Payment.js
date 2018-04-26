const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    school_id:{
        type:String,
        required:true
    },
    student_id:{
        type:String,
        required:true
    },
    session_id:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    staff_role:{
        type:Number,
        required:true
    },
    staff_id:{
        type:String,
        required:false
    }
})