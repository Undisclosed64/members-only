const express = require('express');
const router = express.Router();
const mainController = require('../controllers/index')

//home page
router.get('/', mainController.homePage);

//sign up get route
router.get('/sign-up',mainController.getSignUp);

//sign up post route
router.post('/sign-up',mainController.handleSignUp);




module.exports = router;