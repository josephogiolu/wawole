const express = require('express');
const authController = require('../controllers/authController');

const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.route('/').get(notificationController.getAllNotification).post(
  //authController.protect,
  //authController.restrictTo('user'),
  notificationController.createNotification
);

router
  .route('/:id')
  .get(notificationController.getNotification)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    notificationController.updateNotification
  );
module.exports = router;
