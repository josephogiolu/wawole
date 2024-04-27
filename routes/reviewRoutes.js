const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route('/')
  .get(reviewController.getAllReviews, function (req, res) {
    res.send('get reviews');
  })

  .post(
    authController.restrictTo('user'),
    authController.protect,
    //reviewController.setTourUserIds,
    reviewController.createReview
  );
  
  router.get('/me', reviewController.getMyReviews);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
