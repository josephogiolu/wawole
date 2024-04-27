const mongoose = require('mongoose');
const validator = require('validator');

const requestTransactionSchema = new mongoose.Schema(
  {
    adminUserId: {
      type: 'ObjectId',
      ref: 'User',
      required: true,
    },
    requestId: {
        type: 'ObjectId',
        ref: 'Request',
        required: true,
      },
    fromStatus: {
      type: String,
      enum: [
        'Initial',
        'Assigned',
        'Processing',
        'Rejected',
        'Confirmed',
        'Resolved',
        'Withdrawn',
        'Closed',
      ],
      required: true,
    },
    toStatus: {
        type: String,
        enum: [
          'Assigned',
          'Processing',
          'Rejected',
          'Confirmed',
          'Resolved',
          'Withdrawn',
          'Closed',
        ],
        required: true,
      },
    feedback:{
        type: String,
    },
  },

  {
    timestamps: {
      createdAt: 'requestTransactionCreatedAt',
      updatedAt: 'requestTransactionModifiedAt',
    },  
  }
);
const RequestTransaction = mongoose.model('RequestTransaction', requestTransactionSchema);
module.exports = RequestTransaction;
