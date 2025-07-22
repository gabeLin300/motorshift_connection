const express = require('express');
const router = express.Router();
const controller = require('../controllers/mainController')

//GET home page
router.get('/', controller.index);
//GET contact page
router.get('/contact', controller.contact);
//GET about page
router.get('/about', controller.about);


module.exports = router;
