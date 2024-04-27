const mongoose = require('mongoose');
const { messageSchema } = require('./messageModel');

const conversationSchema = new mongoose.Schema({
  from: {
    type: 'ObjectId',
    ref: 'User',
    required: true,
  },
  to: {
    type: 'ObjectId',
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
  },
  homeId: {
    type: 'ObjectId',
    ref: 'Home',
    required: true,
    // the homeId field is being reviewed
  },
  messages: {
    type: [messageSchema],
    default: undefined,
    required: true,
  },
  extendNotifRequired: {
    type: Boolean,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});
const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
