const express = require('express');
const homeTourController = require('../controllers/homeTourController');
const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(homeTourController.getAllHomeTour)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    homeTourController.createHomeTour
  );

router
  .route('/:id')
  .get(homeTourController.getHomeTour)
  .patch(authController.protect, homeTourController.updateHomeTour)
  .delete(
    authController.protect,
    authController.restrictTo('user'),
    homeTourController.deleteHomeTour
  );

router
  .route('/:id')
  //.get(requestController.getRequest)
  .patch(authController.protect, 
    authController.restrictTo('admin'),
    homeTourController.updateHomeTour)
  .get(homeTourController.getAllHomeTour)
  // .delete(
  //   authController.protect,
  //   authController.restrictTo('user'),
  //   requestController.deleteRequest
  ;
module.exports = router;
