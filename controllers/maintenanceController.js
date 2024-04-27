const Maintenance = require('../models/maintenanceDetailsModel');
const Home = require('../models/homeModel');

const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');

//exports.createMaintenance = handlerFactory.createOne(Maintenance);
exports.getAllMaintenance = handlerFactory.getAll(Maintenance);
exports.getMaintenance = handlerFactory.getOne(Maintenance);
exports.updateMaintenance = handlerFactory.updateOne(Maintenance);
exports.deleteMaintenance = handlerFactory.deleteOne(Maintenance);

exports.createMaintenance = catchAsync(async (req, res, next) => {
    const home =  await Home.findById(req.body.homeId);
       if(!home) {
         return next(new AppError(`No home with id : ${req.body.homeId}`, 400));
       }
  
   //req.body.requestDetails = ValidationDetails.id;
   const doc = await Request.create(req.body)
   
   res.status(201).json({
     status: 'success',
     data: {
       data: doc,
     },
   });
  });