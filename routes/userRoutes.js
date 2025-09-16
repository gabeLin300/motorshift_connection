const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController')
const {isGuest, isAuthenticated} = require('../middleware/auth');
const {logInLimiter} = require('../middleware/rateLimiters');
const {logInValidator, signUpValidator, validationResults} = require('../middleware/validators');

//GET form to add a new user
router.get('/new', isGuest, controller.new);

//POST a new user
router.post('/', isGuest, signUpValidator, validationResults, controller.create);

//GET the login page
router.get('/login', isGuest, controller.login);

//POST login a user
router.post('/login', logInLimiter, isGuest, logInValidator, validationResults, controller.newSession);

//GET user profile
router.get('/profile', isAuthenticated, controller.profile);

//GET logout user
router.get('/logout', isAuthenticated, controller.logout);

module.exports = router;