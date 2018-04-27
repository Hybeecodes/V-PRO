const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    school_id:{
        type:String,
        required: true
    },
    name:{
        type: String,
        required: true
    }
})

 const Session = mongoose.model('Session',SessionSchema);

 module.exports = Session;