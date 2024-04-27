const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    addressType: {
      type: String,
      enum: ['Billing', 'Home', 'Office', 'Facebook', 'Twitter', 'LinkedIn'],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    addressPrimary: {
      type: Boolean,
    },
    street: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    city: {
      type: String,
    },
    stateProvince: {
      type: String,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
        //required: true
      },
      coordinates: [Number],
      address: String,
    },
  },
  {
    timestamps: {
      createdAt: 'addressCreatedAt',
      updatedAt: 'addressModifiedAt',
    },
  }
);
addressSchema.index({ location: '2dsphere' });
const Address = mongoose.model('Address', addressSchema);
module.exports = { Address, addressSchema };
