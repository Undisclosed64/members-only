const express = require('express');
const router = express.Router();
const mainController = require('../controllers/index')

//home page
//router.get('/', mainController.homePage);

//sign up get route
router.get('/sign-up',mainController.getSignUp);

//sign up post route
router.post('/sign-up',mainController.handleSignUp);

//get login
router.get('/log-in',mainController.getLogIn);

//become a member route
router.get('/become-member',mainController.becomeMemberGet)

//post for become-member
router.post('/become-member',mainController.becomeMemberPost);

router.get('/message/create',mainController.createMsgGet);

router.post('/message/create',mainController.createMsgPost);

module.exports = router;