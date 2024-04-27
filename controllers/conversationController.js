const Conversation = require('../models/conversationModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

exports.createConversation = catchAsync(async (req, res, next) => {
  const newMessage = req.body.messages;
  newMessage.forEach(function (el) {
    el.from = req.User.id;
    el.time = new Date();
  });

  req.body.from = req.User.id;
  const doc = await Conversation.create(req.body);
  //const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(req.User).createNotif('message', 'New conversation');
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.getConversation = handlerFactory.getOne(Conversation, {
  path: 'reviews',
});
exports.deleteConversation = handlerFactory.deleteOne(Conversation);
exports.getAllConversation = handlerFactory.getAll(Conversation);
exports.updateConversation = catchAsync(async (req, res, next) => {
  await new Email(req.User).createNotif('message', 'New message');
  if (!req.params.id) {
    next(new AppError('Please provide a conversationID', 400));
  }
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    return next(new AppError('No document found with this ID', 404));
  }
  const newMessage = req.body.messages;
  newMessage.forEach(function (el) {
    el.from = req.User.id;
    el.time = new Date();
  });
  req.body.from = req.User.id;
  const oldMessage = conversation.messages;
  oldMessage.forEach(function (el) {
    req.body.messages.push(el);
  });
  const doc = await Conversation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
