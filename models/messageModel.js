const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    from: {
      type: 'ObjectId',
      ref: 'User',
      required: true,
    },
    time: {
      type: Date,
      required: true,
      // default: Date.now(),
    },
    extendNotifSent: {
      type: Boolean,
    },
  },
  {
    timestamps: {
      createdAt: 'userCreatedAt',
    },
  }
);
const Message = mongoose.model('Message', messageSchema);
module.exports = { Message, messageSchema };
