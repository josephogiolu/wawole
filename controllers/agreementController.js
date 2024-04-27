const moment = require('moment');
const Agreement = require('../models/agreementModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const Email = require('../utils/email');
const Offer = require('../models/offerModel');

// exports.createAgreement = catchAsync(async (req, res, next) => {
//   req.body.offerDetails.landlordId = req.User.id;
//   const days = req.body.price.duration * 30;
//   req.body.renewDate = moment(req.body.startDate, 'YYYYMMDD').add(days, 'days');
//   const doc = await Agreement.create(req.body);
//   await new Email(req.User).createNotif('agreement', 'New Agreement');
//   res.status(201).json({
//     status: 'success',
//     data: {
//       data: doc,
//     },
//   });
// });

exports.createAgreement = catchAsync(async (req, res, next) => {
  const offer = await Offer.findOne({ _id: req.body.offerId });
  if (!offer) {
    res.send('offer does not exist');
  }
  const days = offer.price.duration * 30;
  req.body.renewDate = moment(req.body.startDate, 'YYYYMMDD').add(days, 'days');
  const doc = await Agreement.create(req.body);
  await new Email(req.User).createNotif('agreement', 'New Agreement');
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getAllAgreement = handlerFactory.getAll(Agreement);
exports.updateAgreement = handlerFactory.updateOne(Agreement);
exports.deleteAgreement = handlerFactory.deleteOne(Agreement);
exports.getAgreement = handlerFactory.getUserHomes(Agreement);
