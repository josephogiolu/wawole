const mongoose = require('mongoose');

const validator = require('validator');

const notificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
      validate: validator.isEmail,
    },
    subject: {
      type: String,
      required: true,
    },
    isSent: {
      type: Boolean,
      default: false,
    },
    externalNotifRequired: {
      type: Boolean,
      required: true,
      default: true,
    },
    mailType: {
      required: true,
      type: String,
      enum: [
        'Welcome',
        'forgotpassword',
        'passwordReset',
        'message',
        'appNotification',
        'offer',
        'agreement',
        'subscription',
        'verifyMail',
      ],
    },
    noOfTrials: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
    },
  }
);
notificationSchema.index({ isSent: 1 });
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
