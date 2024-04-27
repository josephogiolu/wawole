const Transaction = require('../models/transactionHistoryModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');


//exports.createTransaction = handlerFactory.createOne(Transaction);
exports.getAllTransaction = handlerFactory.getAll(Transaction);
exports.getTransaction = handlerFactory.getOne(Transaction);
exports.updateTransaction = handlerFactory.updateOne(Transaction);

exports.createTransaction = catchAsync(async (req, res, next) => {
    req.body.payerId = req.User.id;
    if(req.body.payerId !== req.body.payeeId){
        const doc = await Transaction.create(req.body);
  
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
    } 
  });
