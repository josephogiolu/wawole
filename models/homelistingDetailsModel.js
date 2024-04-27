const mongoose = require('mongoose');
const { addressSchema } = require('./addressModel');
const validator = require ('validator');

const homelistingDetailsSchema = new mongoose.Schema(
  {
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
        required: true,
      },
      coordinates: [Number],
      address: {
        type: String,
        required: true,
      },
      },
    },
      {
        timestamps: {
          createdAt: 'homelistingDetailsCreatedAt',
          updatedAt: 'homelistingDetailsModifiedAt',
        },
      }  
);

const HomelistingDetails = mongoose.model('HomelistingDetails', homelistingDetailsSchema);
module.exports = {HomelistingDetails, homelistingDetailsSchema};
