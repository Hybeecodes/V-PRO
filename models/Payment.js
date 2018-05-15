const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    school:{
        type:String,
        required:true
    },
    student:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    session:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:Number,
        required:true
    },
    staff_role:{
        type:Number,
        required:false
    },
    staff_id:{
        type:String,
        required:false
    }
})

const Payment = mongoose.model('Payment',PaymentSchema);

module.exports = Payment;