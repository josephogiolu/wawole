const mongoose = require('mongoose');
const { priceSchema } = require('./priceModel');
const { offerDetailSchema } = require('./offerDetailModel');

const agreementSchema = new mongoose.Schema({
  // price: {
  //   type: priceSchema,
  //   required: true,
  // },
  offerId: {
    type: 'ObjectId',
    ref: 'Offer',
    required: true,
  },
  startDate: {
    type: Date,
    require: true,
  },
  renewDate: {
    type: Date,
    require: true,
  },
  endDate: {
    type: Date,
    require: true,
  },
  addendum: {
    type: [
      {
        priceChange: {
          type: Number,
          require: true,
          //default: 0,
        },
        startDate: {
          type: Date,
          require: true,
        },
        endDate: {
          type: Date,
          require: true,
        },
      },
    ],
  },
});

const agreementModel = mongoose.model('agreement', agreementSchema);
module.exports = agreementModel;
