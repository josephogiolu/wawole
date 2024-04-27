const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');

//exports.createSubscription = handlerFactory.createOne(Subscription);
//exports.getAllSubscriptions = handlerFactory.getAll(Subscription);
//exports.getSubscription = handlerFactory.getOne(Subscription);
//exports.deleteSubscriptionPlan = handlerFactory.deleteOne(SubscriptionPlan);
//exports.updateSubscription = handlerFactory.updateOne(Subscription);

//exports.createSubscription = handlerFactory.createOne(Subscription);

/* exports.updateSubscription = catchAsync(async (req, res, next) => {
  // 2) Filtered out unwanted fieldnames that is not allowed to be updated

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No document found with this ID', 404));
  }

  //if(req.body){
  //Get the old addresses from the User (in context)
  const oldBenefits = user.subscription.benefits;
  console.log(oldBenefits);
  //Loop through all the addresses in oldAddress
  //For each element (address), add it to the new address through req.body.addresses
  oldBenefits.forEach((el) => {
    //Add each element to list of addresses that came from body
    req.body.benefits.push(el);
  });
//}

  const updateSubscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updateSubscription,
    },
  });
});

exports.terminateSubscription = catchAsync(async (req, res, next) => {

  const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  
  if (!subscription) {
    return next(new AppError('No Subscription found with that ID', 404));
  }
  res.status(200).json({
    status: 'successfully terminated your subscription',
    data: null,
  });
});

exports.deleteSubscription = catchAsync(async (req, res, next) => {
  const subscription = await Subscription.findByIdAndDelete(req.params.id);

  if (!subscription) {
    return next(new AppError('No Subscription found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
 */