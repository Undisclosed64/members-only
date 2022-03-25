const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Message = require('../models/message');
const { body, validationResult,check} = require('express-validator');


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
     body('username').trim().isLength({ min: 1 }).escape().withMessage('Username is required'), 
     body('password', 'Password can not be less than 4 characters').trim().isLength({ min: 4}).escape(),

     //check that both password and confirm password field has the same value
     check('password').exists(),
     check(
       'confirmPassword',
       'Password confirmation field must have the same value as the password field',
     )
       .exists()
       .custom((value, { req }) => value === req.body.password),
      
       
//process the request
    (req,res,next) => {
 const errors = validationResult(req);

 const user = new User({
    username:req.body.username,
    password:req.body.password,
    isMember:false,
})

  //check if the validation and santization has passed or not
  if (!errors.isEmpty()) {
    res.render('signUpForm',{errors:errors.array()})
  }

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
                    res.redirect('/log-in')
                }
        })
        
        })
    },
    
]

//handle get login
exports.getLogIn = function(req,res){
    res.render('LogInForm');

}

//handle get request for become-member route
exports.becomeMemberGet = function(req,res){
    res.render('becomeMember',{user:res.locals.currentUser});
}
      

//handle post request for become-member route
exports.becomeMemberPost = function(req,res,next){
const passCode = req.body.passcode;
if(passCode!== '432'){
    res.render('becomeMember',{user:res.locals.currentUser,err:'Wrong passcode!'})
} else {
    const user = new User(res.locals.currentUser);
    user.isMember = true;

    User.findByIdAndUpdate(res.locals.currentUser._id, user, {}, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
}

}

exports.createMsgGet = function(req,res,next){
    if(res.locals.currentUser!==undefined){
        res.render('createMsgForm',{user:req.user})
    }
    res.redirect('/log-in')
};

exports.createMsgPost = [

body('title').trim().isLength({ min: 1 }).escape().withMessage('Title must not be empty!'),
body('text').isLength({ min: 1 }).withMessage('Text can not be empty!'),

(req,res,next) => {
    //process the request
    const errors = validationResult(req);
     const message = new Message({
         title:req.body.title,
          text:req.body.text,
          date:Date.now(),
          user:req.user._id
     })
     //check if the validation and santization has passed or not
     if (!errors.isEmpty()) {
       res.render('createMsgForm',{errors:errors.array()})
     }
 message.save(function(err){
     if(err){
         return next(err)
     }  else {
      res.redirect('/')
     }
 })
}
]