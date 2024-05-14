const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    userId: {
      type: 'ObjectId',
      ref: 'User',
      required: true,
    },
    homeId: {
      type: 'ObjectId',
      ref: 'Home',
      required: true,
    },
    tourType: {
      type: String,
      enum: ['Physical', 'Virtual'],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    tourDate: {
      type: Date,
      required: true,
    },
    attendee: [
      {
        type: 'ObjectId',
        ref: 'User',
      },
    ],
    numberOfAttendee: {
      type: Number,
      max: 10,
    },
  },
  {
    timestamps: {
      createdAt: 'tourCreatedAt',
      updatedAt: 'tourModifiedAt',
    },
  }
);

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
