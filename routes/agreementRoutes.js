const express = require('express');
const authController = require('../controllers/authController');

const agreementController = require('../controllers/agreementController');

const router = express.Router();
router
  .route('/')
  .get(agreementController.getAllAgreement)
  .post(
    authController.protect,
    authController.restrictTo('user', 'admin'),
    agreementController.createAgreement
  );
router
  .route('/:id')
  .get(agreementController.getAgreement)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    agreementController.updateAgreement
  );
module.exports = router;
