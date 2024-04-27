const mongoose = require('mongoose');
//const validator = require('validator');
//const moment = require('moment');

const subscriptionSchema = new mongoose.Schema(
  {
    subscriptionType: {
      type: String,
      enum: ['Free', 'Silver', 'Gold', 'Platinum', 'Diamond'],
      required: true,
    },
    benefits: [
      {
        benefitType: {
          type: String,
          required: true,
        },
        benefitQuantity: {
          type: Number,
          required: true,
        },
      },
    ],
    starDate: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    endDate: {
      type: Date,
      required: true,
    },

    subscriptionStatus: {
      type: String,
      enum: ['Active', 'Inactive', 'Terminated'],
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'subscriptionCreatedAt',
      updatedAt: 'subscriptionModifiedAt',
    },
  }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = { Subscription, subscriptionSchema };
