const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) => {
  // return jwt.sign({ id: id }, process.env.JWT_SECRET, {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  //newUser.validateToken = undefined;
  console.log(newUser);
  const validateToken = newUser.createValidationToken();

  // const url = `${req.protocol}://${req.get(
  //   'host'
  // )}verifyMail:token=${validateToken}`;
  const url = `${req.protocol}://localhost:3000/verifyMail:token=${validateToken}`;
  await new Email(newUser, url).createNotif(
    'verifyMail',
    'Welcome to the Wawole Family!!'
  );
  await new Email(newUser, url).verifyMail();
  await newUser.save({ validateBeforeSave: false });

  createSendToken(newUser, 201, res);
});

exports.signupOAuth = catchAsync(async (req, res, next) => {
  // Set the password and passwordConfirm for Oauth users
  req.body.password = 'OAuth2o2i#';
  req.body.passwordConfirm = 'OAuth2o2i#';
  req.body.userStatus = 'Active';
  const newUser = await User.create(req.body);
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).createNotif('signup', 'Welcome');
  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting to the token and check if its provided
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log(req.cookie);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401)
    );
  }
  // 2) Validate the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // 3) Check if user still existsSync
  const freshUser = await User.findById(decoded.id);
  console.log(freshUser);
  if (!freshUser) {
    return next(
      new AppError('The user belonging to the token no longer exists', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again', 401)
    );
  }
  //grant access to protected route
  req.User = freshUser;
  next();
});

exports.login = catchAsync(async (req, res, next) => {
  //const newUser = await User.create(req.body);
  const { userName, password } = req.body;

  const user = await User.findOne({ userName });
  // if (user.userType === 'Regular') {
  if (!userName || !password) {
    return next(new AppError('Please provide email and/or password', 400));
  }

  // Check if user exists && password is correctPassword
  const userP = await User.findOne({ userName }).select('+password');

  if (!userP || !(await userP.correctPassword(password, userP.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // if everything ok, send token to client
  createSendToken(user, 200, res);
  //}

  // if (user.userType === 'Oauth') {
  //   if (!userName) {
  //     return next(new AppError('Please provide email', 400));
  //   }
  //   // Check if user exists
  //   const userO = await User.findOne({ userName });
  //   if (userO.userType !== 'Oauth') {
  //     return next(new AppError('Please Select User Type Regular/Ouath', 400));
  //   }

  //   if (!userO) {
  //     return next(new AppError('Incorrect email', 401));
  //   }

  //   // if everything ok, send token to client
  //   createSendToken(userO, 200, res);
  //
});

exports.loginOAuth = catchAsync(async (req, res, next) => {
  // Set the password for Oauth users
  req.body.password = 'OAuth2o2i#';
  this.login(req, res, next);
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    roles = ['admin', 'user'];
    console.log(req.User.role);
    console.log(roles.includes(req.User.role));
    if (!roles.some((i) => req.User.role.includes(i))) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email address
  const user = await User.findOne({ userName: req.body.userName });
  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    /* const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`; */

    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/resetPassword:token=${resetToken}`;
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for 10 min)',
    //   message,
    // });
    await new Email(user).createNotif('forgotpassword', 'Forgot Password');
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email, please try again later',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on tokenExpiredError
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set new passwordResetExpires
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update changePasswordAt property for the user

  // 4) Log the user in, send JWT

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get the user from the collection
  const user = await User.findById(req.User.id).select('+password');

  // 2) Check if posted password is correctPassword
  // if(!user || user.) return next(new AppError)
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // 3) If so, update the password and
  user.password = req.body.passwordNew;
  user.passwordConfirm = req.body.passwordConfirm;
  //user.passwordChangedAt = Date.now() - 1;
  await user.save();

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (!allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};
exports.verifyMail = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  if (!(await User.findOne({ validateToken: token }))) {
    return res.status(403).json({
      data: {
        data: 'Invalid token or token has already been used',
      },
    });
  }
  const user = await User.findOneAndUpdate(
    { validateToken: token },
    { userStatus: 'Active', validateToken: ' ' },
    { new: true }
  );
  return res.status(200).json({
    data: {
      data: user,
    },
  });
});

exports.searchEmail = catchAsync(async (req, res, next) => {
  // 3) Check if email exist existsSync
  const email = await User.findOne(req.params);
  console.log(email);
  if (!email) {
    return next(new AppError('This email does not exists', 401));
  }
  res.status(200).json({
    status: 'success',
    data: {
      data: email.userName,
    },
  });
});
