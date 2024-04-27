//const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const homeRouter = require('./routes/homeRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const conversationRouter = require('./routes/conversationRoutes');
const bookmarkRouter = require('./routes/bookmarkRoutes');
const agreementRouter = require('./routes/agreementRoutes');
const transactionRouter = require('./routes/transactionRoutes');
const subscriptionPlanRouter = require('./routes/subscriptionPlanRoutes');
const requestRouter = require('./routes/requestRoutes');
const tourRouter = require('./routes/tourRoutes');
const requestTransactionRouter = require('./routes/requestTransactionRoutes');
const validationRouter = require('./routes/validationRoutes');
const homeListingRouter = require('./routes/homeListingRoutes');
const maintenanceRouter = require('./routes/maintenanceRoutes');
const homeTourRouter = require('./routes/homeTourRoutes');
const notificationRouter = require('./routes/notificationRoutes');
const offerRouter = require('./routes/offerRoutes');
const emailRouter = require('./routes/emailRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) global middlewares
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

// Set Security http headers
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

// Data Sanitization against NOSQL query injections
app.use(mongoSanitize());
app.use(cookieParser());
// Data Sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['amenities', 'ratingsAverage', 'ratingsQuantity', 'filter'],
  })
);

// Test middleware: take a look at objects
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Routes
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'Exciting times on the way with Wawole',
    user: 'Wawole',
  });
});

app.use('/api/v1/homes', homeRouter);
app.use('/api/v1/emails', emailRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/conversations', conversationRouter);
app.use('/api/v1/bookmarks', bookmarkRouter);
//app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/subscriptionPlans', subscriptionPlanRouter);

app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/offers', offerRouter);
app.use('/api/v1/agreements', agreementRouter);
app.use('/api/v1/requests', requestRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/requestTransactions', requestTransactionRouter);
app.use('/api/v1/validations', validationRouter);
app.use('/api/v1/homeListings', homeListingRouter);
app.use('/api/v1/maintenances', maintenanceRouter);
app.use('/api/v1/homeTours', homeTourRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
