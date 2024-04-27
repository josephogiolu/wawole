const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('./handlerFactory');
const User = require('../models/userModel');
const Home = require('../models/homeModel');



exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  //if (!req.body.User) req.body.User = req.params._id;
  //if (!req.body.User) req.body.User = req.User._id;
  //if (!req.body.Home) req.body.Home = req.params._d;
  next();
};
//exports.createReview = handlerFactory.createOne(Review);
exports.getAllReviews = handlerFactory.getAll(Review);
exports.getReview = handlerFactory.getOne(Review);
exports.deleteReview = handlerFactory.deleteOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);

exports.createReview = catchAsync(async (req, res, next) => {
  console.log(`this id is ${req.User._id}`);
  req.body.reviewer = req.User._id;
  const reviewUser =  await User.findById(req.body.reviewedUser);
  const reviewHome =  await Home.findById(req.body.reviewedHome);

  if(req.body.reviewType === 'User')
    {
      if(!reviewUser) {
        return next(new AppError(`No user with id : ${req.body.reviewedUser}`, 400));
      }
    }

  if(req.body.reviewType === 'Home'){
    if(!reviewHome) {
      return next(new AppError(`No home with id : ${req.body.reviewedHome}`, 400));
    }
  }
      
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,

    },
  });
});

catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.userId) filter = { reviewedUser: req.params.userId };
  if (req.params.homeId) filter = { reviewedHome: req.params.homeId };
  // Execute the query
  //const reviews = await Review.find(filter);
  const features = new APIFeatures(Review.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reviews = await features.query;

  // Send the result
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  //.populate({
  //  path: 'guides',
  //  select: '-__v -passwordChangedAt',
  //});
  //Tour.findOne({_id: req.params.id})

  if (!review) {
    return next(new AppError('No home found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return next(new AppError('No home found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
    
    // exports.getMyReviews = catchAsync(async (req, res, next) => {
    //   // req.body.reviewedUser === req.User.id;
    //   // if(req.body.reviewType = "User" ){
    //   //req.params.id = req.User._id;
      
    //     const review = await Review.find();
    //     let filter = {};
  
    //     const features = new APIFeatures(Review.find(filter), req.query)
    //     .filter()
    //     .sort()
    //     .limitFields()
    //     .paginate();
    //   const reviews = await features.query;
    
    //       res.status(200).json({
    //         status: 'success',
    //         results: reviews.length,
    //         data: {
    //           doc: review.reviewedUser === req.User.id,
    //         },
    //       });
     
    //   // if (!review) {
    //   //   return next(new AppError('No review found ', 404));
    //   // }
        
    // });


    exports.getMyReviews = handlerFactory.getUserReview(Review);
    
    