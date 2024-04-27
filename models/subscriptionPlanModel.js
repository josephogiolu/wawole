const mongoose = require('mongoose');
const { priceSchema } = require('./priceModel');

const subscriptionPlanSchema = new mongoose.Schema(
  {
    planType: {
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
    price: {
      type: priceSchema,
      //required: false,
    },
  },
  {
    timestamps: {
      createdAt: 'subscriptionPlanCreatedAt',
      updatedAt: 'subscriptionPlanModifiedAt',
    },
  }
);

const SubscriptionPlan = mongoose.model(
  'SubscriptionPlan',
  subscriptionPlanSchema
);

module.exports = SubscriptionPlan;
