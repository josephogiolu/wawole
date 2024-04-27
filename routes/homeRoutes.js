const express = require('express');
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
//const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:homeId/reviews', reviewRouter);

//router.param('id', tourController.checkID);

// router
//   .route('/top-5-cheap')
//   .get(homeController.aliasTopHomes, homeController.getAllHomes);

router.route('/home-stats').get(homeController.getHomeStats);
// router.route('/monthly-plan/:year').get(
//   authController.protect,
//   authController.restrictTo('admin', 'lead-guide', 'guide')
//   //homeController.getMonthlyPlan
// );

router
  .route('/homes-within/:distance/center/:latlng/unit/:unit')
  .get(homeController.getHomesWithin);

router.route('/distances/:latlng/unit/:unit').get(homeController.getDistances);

router
  .route('/')
  .get(homeController.getAllHomes)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    homeController.createHome
  );

router.route('/topHomes').get(homeController.topXHomes);

router
  .route('/:id')
  .get(homeController.getHome)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'user'),
    homeController.uploadHomePhotos,
    homeController.resizeHomePhotos,
    homeController.updateHome
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    homeController.deleteHome
  );

router.route('/user/:userID').get(homeController.getUserHomes);

router.route('/:homeID/nearby').get(homeController.getHomesNearby);
router.route('/:homeID/similarHomes').get(homeController.similarHomes);

module.exports = router;
