const Offer = require('../models/offerModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
exports.createOffer = catchAsync(async (req, res, next) => {
  req.body.offerDetails.tenantId = req.User.id;
  req.body.offerEndDate = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * process.env.OFFER_EXPIRES_IN
  );
  const doc = await Offer.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getMyOffersLandlord = catchAsync(async (req, res, next) => {
  console.log(req.User.id);
  const offers = await Offer.find({ "offerDetails.landlordId" : req.User.id });
  res.status(200).json({
    status: 'success',
    data: {
      data: offers.length,
      offers,
    },
  });
});

exports.getMyOffersTenant = catchAsync(async (req, res, next) => {
  console.log(req.User.id);
  const offers = await Offer.find({ "offerDetails.tenantId" : req.User.id });
  res.status(200).json({
    status: 'success',
    data: {
      data: offers.length,
      offers,
    },
  });
});

exports.getAllOffers = handlerFactory.getAll(Offer);
exports.getOffer = handlerFactory.getOne(Offer);
exports.updateOffer = handlerFactory.updateOne(Offer);