const express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(bookmarkController.getAllBookmarks)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    bookmarkController.createBookmark
  );
router.route('/:id').get(bookmarkController.getBookmark);
module.exports = router;
