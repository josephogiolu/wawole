const express = require('express');
const homeListingController = require('../controllers/homeListingController');
const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(homeListingController.getAllHomelisting)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    homeListingController.createHomelisting
  );

router
  .route('/:id')
  .get(homeListingController.getHomelisting)
  .patch(authController.protect, homeListingController.updateHomelisting)
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    homeListingController.deleteHomelisting
  );

router
  .route('/:id')
  //.get(requestController.getRequest)
  .patch(authController.protect, 
    authController.restrictTo('admin'),
    homeListingController.updateHomelisting)
  //.get(homeListingController.getAllRequestStatus)
  // .delete(
  //   authController.protect,
  //   authController.restrictTo('user'),
  //   requestController.deleteRequest
  ;
module.exports = router;
