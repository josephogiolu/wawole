const SubscriptionPlan = require('../models/subscriptionPlanModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

//exports.createSubscription = handlerFactory.createOne(Subscription);
exports.getAllSubscriptionsplan = handlerFactory.getAll(SubscriptionPlan);
exports.getSubscriptionPlan = handlerFactory.getOne(SubscriptionPlan);
//exports.deleteSubscriptionPlan = handlerFactory.deleteOne(SubscriptionPlan);
//exports.updateSubscription = handlerFactory.updateOne(Subscription);

//exports.createSubscriptionPlan = handlerFactory.createOne(SubscriptionPlan);
exports.createSubscriptionPlan = catchAsync(async (req, res, next) => {
  //const date = new Date();
  req.body.price.duration  = req.body.price.duration * 30;
  //req.body.endDate = date.setDate(date.getDate() + days);
  const doc = await SubscriptionPlan.create(req.body);
  await new Email(req.User).createNotif('appNotification', 'New Subscription');
  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.updateSubscriptionPlan = catchAsync(async (req, res, next) => {
  // 2) Filtered out unwanted fieldnames that is not allowed to be updated
  const subscriptionPlan = await SubscriptionPlan.findById(req.params.id);
  if (!subscriptionPlan) {
    return next(new AppError('No document found with this ID', 404));
  }
  //if(req.body.benefits){
  //Get the old addresses from the User (in context)
  const oldBenefits = subscriptionPlan.benefits;

  //Loop through all the addresses in oldAddress
  //For each element (address), add it to the new address through req.body.addresses
  oldBenefits.forEach((el) => {
    //Add each element to list of addresses that came from body
    req.body.benefits.push(el);
    console.log(`old benefits after push${oldBenefits}`);
  });
  //}

  const updateSubscriptionPlan = await SubscriptionPlan.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  await new Email(req.User).createNotif(
    'appnotification',
    'Subscription Updates'
  );
  res.status(200).json({
    status: 'success',
    data: {
      user: updateSubscriptionPlan,
    },
  });
});

exports.deleteSubscriptionPlan = catchAsync(async (req, res, next) => {
  //req.body.userId = req.User.id;
  const subscriptionPlan = await SubscriptionPlan.findByIdAndDelete(
    req.params.id
  );

  if (!subscriptionPlan) {
    return next(new AppError('No Subscription found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
