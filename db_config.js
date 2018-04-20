// import { mongo } from 'mongoose';

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/v-pro',function(err){
    if(err){
        throw err;
    }else{
        console.log('connected to database successfully');
    }
})