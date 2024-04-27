const mongoose = require('mongoose');

const paymentInfoSchema = new mongoose.Schema(
  {
  accountFirstName: {
    type: String,
  },
  accountMiddleName: {
    type: String,
  },
  accountLastName: {
    type: String,
  },
  accountNumber: {
    type: Number,
    max: 11,
  },
  bankName: {
    type: String,
  },
  accountBalance:{
      type: Number,
      default: 0,
  },
  accountCurrency: {
    type: String,
    enum:['Naira, Dollar, Euro'],
  },
  sortCode: {
    type: String,
  },
  balanceType: {
    type: String,
    enum: ['Debit', 'Credit'],
    default: 'Debit',
  },
},
{
  timestamps: {
    createdAt: 'paymentInfoCreatedAt',
    updatedAt: 'paymentInfoModifiedAt',
  },
}
);

const paymentInfo = mongoose.model('PaymentInfo', paymentInfoSchema);

module.exports = { paymentInfo, paymentInfoSchema };
