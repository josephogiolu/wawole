const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');
const User = require('../models/userModel');


exports.createTour = catchAsync(async (req, res, next) => {
  req.body.userId = req.User.id;
  /* if(req.body.requestType === 'Validation'){
    req.body.validationDetail = true
  } */
  
  const doc = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (!allowedFields.includes(el)) newObj[el] = obj[el];
    });
  
    return newObj;
  };

exports.attend = catchAsync(async (req, res, next) => {
  
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return next(new AppError('No document found with this ID', 404));
    }
    console.log(tour.attendee)
    //req.body.userId = req.User.id;
    const existingAttendee = tour.attendee;
    //if (existingRole !== null) {
        existingAttendee.forEach((el) => {
        req.body.attendee.push(el);
      });
    
      // if (existingAttendee.foreach((exist) => {req.body.attendee(exist) })) {
      //   return next(new AppError('attendee with this ID already exist', 404));
      // }
    
    // 3) Update Tour document
    const updateAttendee = await Tour.findByIdAndUpdate(req.params.id, {attendee: req.body.attendee},  {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        user: updateAttendee,
      },
    });
  });

  exports.removeAttendee = catchAsync(async (req, res, next) => {
    
    // 2) Filtered out unwanted fieldnames that is not allowed to be updated
    
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return next(new AppError('No document found with this ID', 404));
    }
    req.body.requestUserId = req.User.id;

    const existingAttendee = tour.attendee;
    //if (existingRole !== null) {
        existingAttendee.forEach((el) => {
        req.body.attendee.push(el);
      });

    // 3) Update Tour document
    const updateAttendee = await Tour.findByIdAndUpdate(req.params.id,  {attendee: req.body.attendee}, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        user: updateAttendee,
      },
    });
  });
exports.getAllTour = handlerFactory.getAll(Tour);
exports.getTour = handlerFactory.getOne(Tour);
exports.updateTour = handlerFactory.updateOne(Tour);
exports.deleteTour = handlerFactory.deleteOne(Tour);

