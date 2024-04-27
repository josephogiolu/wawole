/* const express = require('express');
const authController = require('../controllers/authController');
const subscriptionController = require('../controllers/subscriptionController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route('/')
  .get(subscriptionController.getAllSubscriptions)
  .post(
    authController.restrictTo('user'),
    authController.protect,
    subscriptionController.createSubscription
  );

router
  .route('/:id')
  .get(subscriptionController.getSubscription)
  .patch(
    authController.restrictTo('user', 'admin'),
    subscriptionController.updateSubscription
  )
  .put(
    authController.restrictTo('user', 'admin'),
    subscriptionController.terminateSubscription

  )
  .delete(
    authController.restrictTo('user', 'admin'),
    subscriptionController.deleteSubscription
  );

module.exports = router;
 */