const express = require('express');
//const authController = require('../controllers/authController');

const emailController = require('../controllers/emailController');

const router = express.Router();
router.post('/sendMail/:userName', emailController.sendMail);

module.exports = router;