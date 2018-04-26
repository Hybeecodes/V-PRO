const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParentSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    phone:{
    type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    profession:{
        type:String,
        required:true
    },
    school_id:{
        type: String,
        required:true
    },
    gender:{
        type: String,
        required:true
    }

})

const Parent = mongoose.model('Parent',ParentSchema);
module.exports = Parent;
