const mongoose = require('mongoose');
const  {validationDetailsSchema}  = require('./validationDetailsModel');
const  {homelistingDetailsSchema}  = require('./homelistingDetailsModel');
const  {maintenanceDetailsSchema}  = require('./maintenanceDetailsModel');
const  {homeTourSchema}  = require('./homeTourModel');

const validator = require('validator');

const requestSchema = new mongoose.Schema(
  {
    requestUserId: {
      type: 'ObjectId',
      ref: 'User',
      required: true,
    },
    requestType: {
      type: String,
      enum: ['Validation', 'HomeTour', 'HomeListing', 'Maintenance'],
      required: true,
    },
    // requestDetails: {
    //   type: 'ObjectId',
    //   refPath: 'requestType',
    //    required: true,
    // },
    validationDetails:{
      type: validationDetailsSchema,
    },
    homeTourDetails:{
      type: homeTourSchema,
    },
    homelistingDetails:{
      type: homelistingDetailsSchema,
    },
    maintenanceDetails:{  
      type: maintenanceDetailsSchema,
    },
    requestStatus: {
      type: String,
      enum: [
        'Initial',
        'Assigned',
        'Processing',
        'Rejected',
        'Confirmed',
        'Resolved',
        'Withdrawn',
      ],
      default: 'Initial',
    },
  },

  {
    timestamps: {
      createdAt: 'requestCreatedAt',
      updatedAt: 'requestModifiedAt',
    },  
  }
);

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
