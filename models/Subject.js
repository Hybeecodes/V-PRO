const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    school_id:{
        type:String,
        required: true
    }
})