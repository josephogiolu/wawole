const mongoose = require('mongoose');

const transactionHistorySchema = new mongoose.Schema({
  payerId: {
    type: 'ObjectId',
    ref: 'User'
  },
  payeeId: {
    type: 'ObjectId',
    ref: 'User',
  },
  amount: {
    type: Number,
  },
  currency: {
    type: String,
    enum: ['Naira', 'Dollar', 'Euro'],
  },
  // dateOfTransaction: {
  //   type: Date,
  // },
  status:{
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Pending',
  },
},
{
    timestamps: {
      createdAt: 'transactionCreatedAt',
      updatedAt: 'transactionModifiedAt',
    },
  }
);

const transactionHistory = mongoose.model('transactionHistory', transactionHistorySchema);

module.exports = transactionHistory;
