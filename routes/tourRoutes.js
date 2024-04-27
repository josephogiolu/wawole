const express = require('express');
const authController = require('../controllers/authController');
const tourController = require('../controllers/tourController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route('/')
  .get(tourController.getAllTour)
  .post(
    authController.restrictTo('user'),
    authController.protect,
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.restrictTo('user', 'admin'),
    //tourController.updateTour,
    //tourController.attend,
    tourController.removeAttendee
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    tourController.deleteTour
  );

  // router.patch(
  //   '/update/:id',
  //   tourController.attend,
  //   tourController.removeAttendee
  // );

module.exports = router;
