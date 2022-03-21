const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');



var async = require('async');


//All the routes will go here
//home page
exports.homePage = function(req,res){
    res.render('index');
}

//get sign up page
exports.getSignUp = function(req,res){
    res.render('signUpForm',{title:'Sign Up'});
}

//handle post request for signup
exports.handleSignUp = [
     // Validate and sanitize the field.
     body('name', 'User name is required').trim().isLength({ min: 1 }).escape(),
     body('password', 'Password can not be less than 4 characters').trim().isLength({ min: 4}).escape(),

    (req,res,next) => {

 const errors = validationResult(req);

  const user = new User({
      name:req.body.name,
      password:req.body.password
  })
 
  if (!errors.isEmpty()) {
    
    res.render('signUpForm',{user:user,errors:errors.array()})

  } else {
    bcrypt.hash(user.password,10,(err,hashedPassword) => {
        if(err){
            return err;
        } 
   const securedUser = new User({
      name:req.body.name,
      password:hashedPassword,
      _id:user._id
   })
            securedUser.save(function(err){
                if(err){
                    return next(err);
                } else {
                    res.redirect('/')
                }
        })
        
        })
    }
    }   
]