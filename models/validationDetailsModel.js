const mongoose = require('mongoose');
//const { addressSchema } = require('./addressModel');
//const validator = require('validator');

const validationDetailsSchema = new mongoose.Schema(
  {
          photoIdType: {
            type: String,
            enum: ['International Passport', 'GovtID'],
            required: true,
          },
          photoIdPath: {
            type: String,
            required: true,
          },
          photoIdnumber: {
            type: Number,
            required: true,
          },
          photoRealTimePath: {
            type: String,
            required: true,
          },
        },
      {
        timestamps: {
          createdAt: 'validationDetailsCreatedAt',
          updatedAt: 'validationDetailsModifiedAt',
        },
      }  
);

const ValidationDetails = mongoose.model('ValidationDetails', validationDetailsSchema);
module.exports = {ValidationDetails, validationDetailsSchema};
