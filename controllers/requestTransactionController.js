const RequestTransaction = require('../models/requestTransactionModel');
const User = require('../models/userModel');
const Request = require('../models/requestModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');



exports.createRequestTransaction = catchAsync(async (req, res, next) => {
  const requestId = await Request.findOne({_id : req.body.requestId});
    if(!requestId){
      return next(new AppError(`Enter a valid request ID`, 400));
      }
        if(req.User.role !== 'admin' && req.User.role !== 'user'){
          return next(new AppError(`You do not have admin role`, 400));
        }
        req.body.adminUserId = req.User.id;
        const doc = await RequestTransaction.create(req.body);

          res.status(201).json({
          status: 'success',
          data: {
            data: doc,
          },
        });
});


exports.updateRequestTransaction = catchAsync(async (req, res, next) => {
        //req.body.adminUserId = req.User.id;
        const requestId = await Request.findOne({_id: req.User.id});
        console.log(requestId)
        if(requestId.role !== 'admin' && requestId.role !== 'user'){
          return next(new AppError(`You do not have admin role`, 400));
        }
        const doc = await RequestTransaction.findByIdAndUpdate(req.param.id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!doc) {
          return next(new AppError('No document found with that ID', 404));
        }
          res.status(200).json({
          status: 'success',
          data: {
            data: doc,
          },
        });
});

// exports.updateRequest = 
//   catchAsync(async (req, res, next) => {
//     if(req.User.role === 'admin' && req.User.role === 'user')
//     req.body.adminUserId = req.User.id;

//     if(req.body.requestType === 'Maintenance'){
//       if(req.body.requestMaintenanceDetails === null ||  req.body.requestMaintenanceDetails === undefined){
      
//         return next(new AppError(`Maintenance datails needs to be entered`, 400));
//     }
//   }
 
//     const doc = await Request.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!doc) {
//       return next(new AppError('No document found with that ID', 404));
//     }

//     res.status(200).json({
//       status: 'success',
//       data: {
//         doc,
//       },
//     });
//   });


// exports.createRequestTransaction = catchAsync(async (req, res, next) => {
//     req.body.adminUserId = req.User.id;
//     const doc = await RequestTransaction.create(req.body);
  
//     res.status(201).json({
//       status: 'success',
//       data: {
//         data: doc,
//       },
//     });
//   });
exports.getAllRequestTransaction = handlerFactory.getAll(RequestTransaction);
exports.getRequestTransaction = handlerFactory.getOne(RequestTransaction);
exports.updateRequestTransaction = handlerFactory.updateOne(RequestTransaction);
exports.deleteRequestTransaction = handlerFactory.deleteOne(RequestTransaction);
