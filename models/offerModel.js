const mongoose = require('mongoose');
const { priceSchema } = require('./priceModel');
const { offerDetailSchema } = require('./offerDetailModel');
const offerSchema = new mongoose.Schema({
  price: {
    type: priceSchema,
    required: true,
  },
  offerDetails: {
    type: offerDetailSchema,
    required: true,
  },
  offerDate: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  offerEndDate: {
    type: Date,
    required: true,
  },
});
const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;
