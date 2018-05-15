// import { mongo } from 'mongoose';

const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_USER}@ds119250.mlab.com:19250/v-pro`,function(err){
    if(err){
        throw err;
    }else{
        console.log('connected to database successfully');
    }
})