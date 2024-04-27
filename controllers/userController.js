const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFactory = require('./handlerFactory');
const { subscriptionSchema } = require('../models/subscriptionModel');
const Email = require('../utils/email');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.User.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (!allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};
exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
// Do Not update passwords with this
//exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
//exports.getAllUsers2 = testHandlerFactory.getAllUser();
//   const users = await User.find();

//   // Send the result
//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

// Admin get all users  ------ Mich
exports.getAllUserAdmin = async (req, res) => {
  const users = await User.find({});

  if (User.role !== admin) {
    throw res.status(500).json({
      status: 'error',
      message: 'This is only for an Admin',
    });
  }
  res.status(200).json({ users, count: users.length });
};

// Admin get a User by the UserId ------ Mich
exports.getSingleUser = async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    return next(new AppError(`No user with id : ${req.params.id}`, 400));
  }
  res.status(200).json({ user });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.User._id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  // 2) Filtered out unwanted fieldnames that is not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'userName',
    'firstName',
    'lastName'
  );
  //console.log(req.file.photo);
  if (req.file) filteredBody.photo = req.file.filename;
  if (req.body.subscription) {
    new Email(req.User).createNotif('appNotification', 'Subscription Updates');
  }

  if (req.body.addresses) {
    //Get the old addresses from the User (in context)
    const oldAddress = req.User.addresses;
    //Loop through all the addresses in oldAddress
    //For each element (address), add it to the new address through req.body.addresses
    oldAddress.forEach((el) => {
      //Add each element to list of addresses that came from body
      req.body.addresses.push(el);
    });
  }

  const existingRole = req.User.role;
  if (existingRole !== null) {
    existingRole.forEach((el) => {
      req.body.role.push(el);
    });
  }

  // 3) Update user document
  const updateUser = await User.findByIdAndUpdate(req.User.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  // 2) Filtered out unwanted fieldnames that is not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'userName',
    'firstName',
    'lastName'
  );
  //console.log(req.file.photo);
  if (req.file) filteredBody.photo = req.file.filename;
  if (req.body.subscription) {
    new Email(req.User).createNotif('appNotification', 'Subscription Updates');
  }

  if (req.body.addresses) {
    //Get the old addresses from the User (in context)
    const oldAddress = req.User.addresses;
    //Loop through all the addresses in oldAddress
    //For each element (address), add it to the new address through req.body.addresses
    oldAddress.forEach((el) => {
      //Add each element to list of addresses that came from body
      req.body.addresses.push(el);
    });
  }

  const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('No document found with this ID', 404));
    }
  if (req.body.role) {
    const existingRole = user.role;
    existingRole.forEach((el) => {
      req.body.role.push(el);
    });
  }

  // 3) Update user document
  const updateUser = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.User.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please user signup instead',
  });
};

// exports.updateUserToken = catchAsync(async (req, res, next) => {
//   const { validateToken } = req.body;

//   const getToken = await User.findOne({ validateToken });
//   if (getToken === req.User.validateToken) {
//     req.User.userStatus = 'Temporary';
//   }
//   // 3) Update user document
//   const updateUser = await User.findByIdAndUpdate(req.User.id, {
//     new: true,
//     runValidators: true,
//   });
//   res.status(200).json({
//     status: 'success',
//     data: {
//       user: updateUser,
//     },
//   });
// });

// (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined',
//   });
// };
