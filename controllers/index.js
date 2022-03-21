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
    res.render('signUpForm');
}

//handle post request for signup
exports.handleSignUp = [
   
    body('name').isLength({ min: 1 }),
    body('password').isLength({ min: 4 }),

    (req, res) => { 
        const errors = validationResult(req);

        const user = new User({
            name:req.body.name,
            password:req.body.password
        
        })
        
        if(!errors.isEmpty()){
            return 'error';
        } else {
            user.save(function(err){
                if(err){
                    return err;
                } else {
                    res.redirect('/')
                }
            
            })
        }
        }
        
    
]