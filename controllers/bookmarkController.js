const Bookmark = require('../models/bookmarkModel');
const catchAsync = require('../utils/catchAsync');
//const AppError = require('../utils/appError');
const handlerFactory = require('./handlerFactory');

exports.createBookmark = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.User.id;
  const doc = await Bookmark.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
exports.getBookmark = handlerFactory.getOne(Bookmark, { path: 'reviews' });
exports.getAllBookmarks = handlerFactory.getAll(Bookmark);
