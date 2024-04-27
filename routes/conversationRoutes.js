const express = require('express');
const authController = require('../controllers/authController');
const conversationController = require('../controllers/conversationController');

const router = express.Router();

router
  .route('/')
  .get(conversationController.getAllConversation)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    conversationController.createConversation
  );

router
  .route('/:id')
  .get(conversationController.getConversation)
  .patch(authController.protect, conversationController.updateConversation);

module.exports = router;
