const express = require('express');
const validationController = require('../controllers/validationController');
const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(validationController.getAllValidation)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    validationController.createValidation
  );

router
  .route('/:id')
  .get(validationController.getValidation)
  .patch(authController.protect, validationController.updateValidation)
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    validationController.deleteValidation
  );

router
  .route('/:id')
  //.get(requestController.getRequest)
  .patch(authController.protect, 
    authController.restrictTo('admin'),
    validationController.updateValidation)
  //.get(validationController.getAllRequestStatus)
  // .delete(
  //   authController.protect,
  //   authController.restrictTo('user'),
  //   requestController.deleteRequest
  ;
module.exports = router;
