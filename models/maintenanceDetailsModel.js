const mongoose = require('mongoose');
const { addressSchema } = require('./addressModel');
const validator = require('validator');

const   maintenanceDetailsSchema = new mongoose.Schema(
  {
          homeId: {
            type: 'ObjectId',
            ref: 'Home',
            required: true,
          },
          subject: {
            type : String,
            required: true,
          },
          body: {
            type: String,
            required: true,
          },
        },
      {
        timestamps: {
          createdAt: 'maintenanceDetailsCreatedAt',
          updatedAt: 'maintenanceDetailsModifiedAt',
        },
      }  
);

const MaintenanceDetails = mongoose.model('MaintenanceDetails', maintenanceDetailsSchema);
module.exports = {MaintenanceDetails, maintenanceDetailsSchema};
