const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email: {
        type:String,
        unique:true,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    photo:{
        type:Object,
        required:false
    },
    phone: {
        type:String,
        required:true
    },
    domain_id:{
        type:String,
        required:false
    },
    deleted:{
        type:Boolean,
        required:true,
        default:false
    },
    created_at:{
        type:Date,
        required:true,
        default: Date.now()
    },
    updated_at:{
        type:Date,
        required:true,
        default: Date.now()
    }
});

const School = mongoose.model('School',SchoolSchema);

function deleteSchool(school_id) {
    
}

module.exports = School;

