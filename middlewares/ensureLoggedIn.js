'use strict';
var express = require('express');
var router = express.Router();
module.exports.EnsureLoggedIn = function(req,res,next) {
    if(req.session.user_session == undefined){
        res.redirect(302,'/login');
    }else{
        next();
    }
}