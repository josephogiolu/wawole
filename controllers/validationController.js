const Validation = require('../models/validationDetailsModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.createValidation = handlerFactory.createOne(Validation);
exports.getAllValidation = handlerFactory.getAll(Validation);
exports.getValidation = handlerFactory.getOne(Validation);
exports.updateValidation = handlerFactory.updateOne(Validation);
exports.deleteValidation = handlerFactory.deleteOne(Validation);
