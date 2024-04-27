const express = require('express');
const requestController = require('../controllers/requestController');
const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(requestController.getAllRequest)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    requestController.createRequest
  );

router
  .route('/:id')
  .get(requestController.getRequest)
  .patch(authController.protect, requestController.updateRequest)
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    requestController.deleteRequest
  );

router
  .route('/:id')
  //.get(requestController.getRequest)
  .patch(authController.protect, 
    authController.restrictTo('admin'),
    requestController.updateRequest)
  //.get(requestController.getAllRequestStatus)
  // .delete(
  //   authController.protect,
  //   authController.restrictTo('user'),
  //   requestController.deleteRequest
  ;
module.exports = router;
