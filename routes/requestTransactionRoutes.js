const express = require('express');
const requestTransactionController = require('../controllers/requestTransactionController');
const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(requestTransactionController.getAllRequestTransaction)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    requestTransactionController.createRequestTransaction
  );

router
  .route('/:id')
  .get(requestTransactionController.getRequestTransaction)
  .patch(authController.protect,
          authController.restrictTo('user'),
         requestTransactionController.updateRequestTransaction)
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    requestTransactionController.deleteRequestTransaction
  );

// router
//   .route('/:id')
//   //.get(requestController.getRequest)
//   .patch(authController.protect, 
//     authController.restrictTo('admin'),
//     requestTransactionController.updateRequest)
  // .delete(
  //   authController.protect,
  //   authController.restrictTo('user'),
  //   requestController.deleteRequest
  //;
module.exports = router;
