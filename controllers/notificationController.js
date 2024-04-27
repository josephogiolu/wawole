const Notification = require('../models/notificationModel');
//const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

exports.createNotification = handlerFactory.createOne(Notification);
exports.getAllNotification = handlerFactory.getAll(Notification);
exports.getNotification = handlerFactory.getOne(Notification);
exports.updateNotification = handlerFactory.updateOne(Notification);
