const express = require('express');
const authController = require('../controllers/authController');
const subscriptionPlanController = require('../controllers/subscriptionPlanController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route('/')
  .get(subscriptionPlanController.getAllSubscriptionsplan)
  .post(
    authController.restrictTo('user'),
    authController.protect,
    subscriptionPlanController.createSubscriptionPlan
  );

router
  .route('/:id')
  .get(subscriptionPlanController.getSubscriptionPlan)
  .patch(
    authController.restrictTo('user', 'admin'),
    subscriptionPlanController.updateSubscriptionPlan
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    subscriptionPlanController.deleteSubscriptionPlan
  );

module.exports = router;
