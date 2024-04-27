const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Specify the amount to be paid'],
  },
  currency: {
    type: String,
    enum: ['Dollar', 'Naira', 'Euro', 'Pound'],
    required: [true, 'Specify your preferred currency'],
  },
  duration: {
    //duration is in months
    type: Number,
    required: true,
    default: 12,
  },
  tolerance: {
    //tolerance is in +-% of amount
    type: Number,
    required: true,
    default: 15,
  },
});

const priceModel = mongoose.model('Price', priceSchema);

module.exports = { priceModel, priceSchema };
