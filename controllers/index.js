const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { body, validationResult,check} = require('express-validator');



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

     //check that both password and confirm password field has the same value
     check('password').exists(),
     check(
       'confirmPassword',
       'password confirmation field must have the same value as the password field',
     )
       .exists()
       .custom((value, { req }) => value === req.body.password),
      
       
//process the request
    (req,res,next) => {
 const errors = validationResult(req);

  const user = new User({
      name:req.body.name,
      password:req.body.password,
  })
  //check if the validation and santization has passed or not
  if (!errors.isEmpty()) {
    res.render('signUpForm',{user:user,errors:errors.array()})
  }
   else {
       //secure the password
    bcrypt.hash(user.password,10,(err,hashedPassword) => {
        if(err){
            return err;
        } 
   const securedUser = new User({
      name:req.body.name,
      password:hashedPassword,
      _id:user._id
   })
   //save the final user with secured password
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