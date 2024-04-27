const express = require('express');
const transactionController = require('../controllers/transactionController');

const authController = require('../controllers/authController');

const router = express.Router();
router.use(authController.protect);

router
  .route('/')
  .get(transactionController.getAllTransaction)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    transactionController.createTransaction
  );

router
 .route('/:id')
 .get(transactionController.getTransaction)
 .patch(authController.restrictTo('user', 'admin'), transactionController.updateTransaction);

module.exports = router;