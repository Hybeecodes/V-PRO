const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    nickname:{
        type: String,
        required:false
    },
    school_id:{
        type: String,
        required:true
    },
    tuition: {
        type:JSON,
        required:false
    }
});

const Class = mongoose.model('Class',ClassSchema);
module.exports = Class;
