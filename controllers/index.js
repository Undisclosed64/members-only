const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Message = require('../models/message');
const { body, validationResult,check} = require('express-validator');
var async = require('async');


//All the routes will go here
//home page
exports.homePage = function(req,res,next){
    Message.find({})
    .populate('user')
    .exec(function(err,messages){
        if(err){
            return next(err)
        }
        res.render('index',{ user: req.user,messages:messages})
   })
}

//get sign up page
exports.getSignUp = function(req,res){
    res.render('signUpForm',{title:'Sign Up'});
}

//handle post request for signup
exports.handleSignUp = [
   
     // Validate and sanitize the field.
     body('username').trim().isLength({ min: 1 }).escape().withMessage('username is required') 
     .isAlphanumeric().withMessage('Name has non-alphanumeric characters.'),

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
      name:req.body.username,
      password:req.body.password,
      isMember:false,
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
      username:req.body.username,
      password:hashedPassword,
      isMember:false,
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

//handle get request for become-member route
exports.becomeMemberGet = function(req,res){
    res.render('becomeMember',{title:'Become a member',user:res.locals.currentUser});
}

//handle get login
exports.getLogIn = function(req,res){
    res.render('LogInForm',{title:'Log in'});

}
      

//handle post request for become-member route
exports.becomeMemberPost = function(req,res,next){
const passCode = req.body.passcode;
if(passCode!== '432'){
    res.send('Wrong passcode!')
} else {
    const user = new User(res.locals.currentUser);
    user.isMember = true;

    User.findByIdAndUpdate(res.locals.currentUser._id, user, {}, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
}

}

exports.createMsgGet = function(req,res){
if(res.locals.currentUser!==undefined){
    res.render('createMsgForm',{title:'Create a message'})
}
res.redirect('/')
}

exports.createMsgPost = function(req,res,next){
body('title').trim().isLength({ min: 1 }).escape().withMessage('Title is required!')
body('text').trim().isLength({ min: 1 }).escape().withMessage('Text can not be empty!');
body('date', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate();

       
//process the request
    const errors = validationResult(req);

     const message = new Message({
         title:req.body.title,
          text:req.body.text,
          date:Date.now(),
          user:req.user._id
     })
     console.log(message.user)
     //check if the validation and santization has passed or not
     if (!errors.isEmpty()) {
       res.render('createMsgForm',{message:message,errors:errors.array()})
     }
 message.save(function(err){
     if(err){
         return next(err)
     }     res.redirect('/')
 })
}