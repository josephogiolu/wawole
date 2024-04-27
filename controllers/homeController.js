const multer = require('multer');
const sharp = require('sharp');
const Home = require('../models/homeModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');

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

exports.uploadHomePhotos = upload.fields([{ name: 'photos', maxCount: 10 }]);

exports.resizeHomePhotos = catchAsync(async (req, res, next) => {
  if (!req.files) return next();
  if (!req.files.photos) return next();

  // //1) Cover image
  // req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  // await sharp(req.files.imageCover[0].buffer)
  //   .resize(2000, 1333)
  //   .toFormat('jpeg')
  //   .jpeg({ quality: 90 })
  //   .toFile(`public/img/users/${req.body.imageCover}`);

  req.body.photos = [];

  await Promise.all(
    req.files.photos.map(async (file, i) => {
      const filename = `home-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      //await sharp(req.files.images[i].buffer) //works as below too.
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${filename}`);

      req.body.photos.push(filename);
    })
  );
  next();
});

// exports.aliasTopHomes = (req, res, next) => {
//   req.query.limit = '5';
//   req.query.sort = 'location,homeType';
//   req.query.fields = 'price,location,homeType,amenities';
//   next();
//};
exports.getAllHomes = handlerFactory.getAll(Home);
exports.getHome = handlerFactory.getOne(Home, { path: 'reviews' });
//exports.createHome = handlerFactory.createOne(Home);
exports.createHome = catchAsync(async (req, res, next) => {
  req.body.landlordId = req.User.id;
  const doc = await Home.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
exports.updateHome = handlerFactory.updateOne(Home);
exports.deleteHome = handlerFactory.deleteOne(Home);
exports.getUserHomes = handlerFactory.getUserHomes(Home);

exports.getHomeStats = catchAsync(async (req, res, next) => {
  const stats = await Home.aggregate([
    {
      $match: { dataQuality: { $gte: 4 } },
    },
    {
      $group: {
        _id: { $toUpper: '$homeType' },
        numHomes: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$averageRatings' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
exports.getHomesWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat, lng.',
        400
      )
    );
  }

  const homes = await Home.find({
    location: { $geoWithin: { $centerSphere: [[lat, lng], radius] } },
    //i changed the position of lat and lng
  });

  res.status(200).json({
    status: 'success',
    results: homes.length,
    data: {
      data: homes,
    },
  });
});

exports.getHomesNearby = catchAsync(async (req, res, next) => {
  if (!req.params.homeID) {
    next(new AppError('Please provide a homeID', 400));
  }
  const home = await Home.findById(req.params.homeID);
  if (!home) {
    return next(new AppError('No document found with this ID', 404));
  }
  const latAndlng = home.location.coordinates;
  const lat = latAndlng[0];
  const lng = latAndlng[1];
  //const [lat, lng] = latAndlng.split(',');
  console.log(home.location);
  const distancesNearby = await Home.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lat * 1, lng * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: 0.001,
        minDistance: 2,
      },
    },
    { $match: { homeType: home.homeType } },

    {
      $project: {
        distance: 1,
        price: 1,
        _id: 1,
        homeType: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    results: distancesNearby.length,
    data: {
      data: distancesNearby,
    },
  });
});
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat, lng.',
        400
      )
    );
  }
  const distances = await Home.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lat * 1, lng * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        homeType: 1,
        distance: 1,
        price: 1,
      },
    },
  ]);
  console.log(distances);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});

exports.similarHomes = catchAsync(async (req, res, next) => {
  if (!req.params.homeID) {
    next(new AppError('Please provide a homeID', 400));
  }
  const home = await Home.findById(req.params.homeID);
  if (!home) {
    return next(new AppError('No document found with this ID', 404));
  }
  const latAndlng = home.location.coordinates;
  const lat = latAndlng[0];
  const lng = latAndlng[1];
  const multiplier = 0.001;
  const similarHomes = await Home.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lat * 1, lng * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },

    {
      $match: {
        $and: [
          { status: 'Published' },
          { rented: false },
          { homeType: home.homeType },
          { buildingType: home.buildingType },
          { waterSource: home.waterSource },
          { prepaidMeter: home.prepaidMeter },
          { roomsEnsuite: home.roomsEnsuite },
          { petsAllowed: home.petsAllowed },
        ],
      },
    },
    { $sort: { distance: 1 } },
  ]);
  res.status(200).json({
    status: 'success',
    results: similarHomes.length,
    data: {
      data: similarHomes,
    },
  });
});

exports.topXHomes = catchAsync(async (req, res, next) => {
  const topHomes = await Home.aggregate([
    {
      $match: {
        status: 'Published',
        dataQuality: { $gte: 4 },
        buildingType: 'NEW',
        waterSource: 'Borehole',
        roomsEnsuite: true,
        prepaidMeter: true,
      },
    },
    {
      $project: {
        location: 1,
        price: 1,
        homeType: 1,
        premiumList: 1,
        amenities: 1,
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      topHomes,
    },
  });
});
