const mongoose = require('mongoose');

const offerDetailSchema = new mongoose.Schema({
  tenantId: {
    type: 'ObjectId',
    ref: 'User',
    required: true,
  },
  landlordId: {
    type: 'ObjectId',
    ref: 'User',
    required: true,
  },
  homeId: {
    type: 'ObjectId',
    ref: 'Home',
    required: true,
  },
  offerStatus: {
    type: String,
    enum: ['Accepted', 'Declined', 'Withdrawn', 'Initial', 'Expired', 'Paid'],
    default: 'Initial',
  },
});
const offerDetailModel = mongoose.model('offerDetails', offerDetailSchema);
module.exports = { offerDetailModel, offerDetailSchema };
