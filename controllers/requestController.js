const Request = require('../models/requestModel');
//const ValidationDetail = require('../models/requestModel');
const Home = require('../models/homeModel');
const HomeListing = require('../models/homelistingDetailsModel');
const MaintenanceDetails = require('../models/maintenanceDetailsModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');



//exports.createRequest = handlerFactory.createOne(Request);
exports.getAllRequest = handlerFactory.getAll(Request);
exports.getRequest = handlerFactory.getOne(Request);
//exports.updateRequest = handlerFactory.updateOne(Request);
exports.deleteRequest = handlerFactory.deleteOne(Request);

exports.createRequest = catchAsync(async (req, res, next) => {
  req.body.requestUserId = req.User.id;
      if(req.body.requestType === 'Validation'){
        if(req.body.validationDetails === null ||  req.body.validationDetails === undefined){
          
            return next(new AppError(`Validation datails needs to be entered`, 400));
          
        }
      }
        if(req.body.requestType === 'HomeListing'){
          if(req.body.homelistingDetails === null ||  req.body.homelistingDetails === undefined){
          
            return next(new AppError(`HomeListing datails needs to be entered`, 400));
        }
      }

      if(req.body.requestType === 'Maintenance'){
        if(req.body.maintenanceDetails === null ||  req.body.maintenanceDetails === undefined){
        
          return next(new AppError(`Maintenance datails needs to be entered`, 400));
      }
      const home =  await Home.findById(req.body.maintenanceDetails.homeId);
       if(!home) {
         return next(new AppError(`No home with id : ${req.body.homeId}`, 400));
       }
    }

    if(req.body.requestType === 'HomeTour'){
      if(req.body.homeTourDetails === null ||  req.body.homeTourDetails === undefined){
      
        return next(new AppError(`Home Tour datails needs to be entered`, 400));
        }
      }
          const doc = await Request.create(req.body);

          res.status(201).json({
            status: 'success',
            data: {
              data: doc,
            },
          });

});

exports.updateRequest = 
  catchAsync(async (req, res, next) => {
    
    req.body.requestUserId = req.User.id;

    if(req.body.requestType === 'Validation'){
      if(req.body.validationDetails === null ||  req.body.validationDetails === undefined){
        
          return next(new AppError(`Validation datails needs to be entered`, 400));
        
      }
    }
      if(req.body.requestType === 'HomeListing'){
        if(req.body.homelistingDetails === null ||  req.body.homelistingDetails === undefined){
        
          return next(new AppError(`HomeListing datails needs to be entered`, 400));
        
      }
    }

    if(req.body.requestType === 'Maintenance'){
      if(req.body.maintenanceDetails === null ||  req.body.maintenanceDetails === undefined){
      
        return next(new AppError(`Maintenance datails needs to be entered`, 400));
    }
    const home =  await Home.findById(req.body.maintenanceDetails.homeId);
       if(!home) {
         return next(new AppError(`No home with id : ${req.body.homeId}`, 400));
       }
    }
    

  if(req.body.requestType === 'HomeTour'){
    if(req.body.homeTourDetails === null ||  req.body.homeTourDetails === undefined){
    
      return next(new AppError(`Home Tour datails needs to be entered`, 400));
  }
}
 
    const doc = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

