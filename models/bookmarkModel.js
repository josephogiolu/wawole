const mongoose = require('mongoose');
const bookmarkSchema = new mongoose.Schema(
  {
    createdBy: {
      type: 'ObjectId',
      ref: 'User',
      required: true,
    },
    createdOn: {
      type: 'ObjectId',
      ref: 'Home',
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
    },
  }
);
bookmarkSchema.index({ createdBy: 1, createdOn: 1 });
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = Bookmark;
