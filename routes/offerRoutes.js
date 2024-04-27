const express = require('express');
const offerController = require('../controllers/offerController');

const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(offerController.getAllOffers)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    offerController.createOffer
  );
router
  .route('/landlord')
  .get(authController.protect, offerController.getMyOffersLandlord);
router
  .route('/tenant')
  .get(authController.protect, offerController.getMyOffersTenant);
router
  .route('/:id')
  .get(offerController.getOffer)
  .patch(authController.protect, offerController.updateOffer);
 
module.exports = router;
