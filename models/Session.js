const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    school_id:{
        type:String,
        required: true
    },
    
})