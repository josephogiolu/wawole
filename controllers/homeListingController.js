const HomeListing = require('../models/homelistingDetailsModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.createHomelisting = handlerFactory.createOne(HomeListing);
exports.getAllHomelisting = handlerFactory.getAll(HomeListing);
exports.getHomelisting = handlerFactory.getOne(HomeListing);
exports.updateHomelisting = handlerFactory.updateOne(HomeListing);
exports.deleteHomelisting = handlerFactory.deleteOne(HomeListing);

