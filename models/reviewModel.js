const mongoose = require('mongoose');
const User = require('./userModel');
const Home = require('./homeModel');

// review user - tour reviewd - review text - createdAt - rating
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      minlength: [3, 'reviews must be 15 or more characters long.'],
      maxlength: [255, 'reviews must be 255 or less characters long.'],
      required: [true, 'review must have a text associated.'],
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    reviewer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must be written by a user.'],
    },
    reviewType: {
      type: String,
      enum: ['User', 'Home'],
      required: true,
      /* validator: function (val) {
          // this only works on SAVE!!! and CREATE
          //let returnval = false;
          if(val === 'User' || val === 'Home')
          //returnval = true;
          return true;
        },
        message: 'reviewType is either Home or User', */
    },
    reviewedUser: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      validate: {
        validator: function (val) {
          if (this.reviewType === 'User') {
            if (val !== null || val !== undefined) return true;
          }
          return false;
        },
        message: 'review must be for a valid user',
      },
    },
    reviewedHome: {
      type: mongoose.Schema.ObjectId,
      ref: 'Home',
      validate: {
        validator: function (val) {
          if (this.reviewType === 'Home') {
            if (val !== null || val !== undefined) return true;
          }
          return false;
        },
        message: 'review must be for a valid home',
      },
    },
  },
  {
    timestamps: true,
  }
);

// A user cant have multiple rating per who or what they want to rate or review
reviewSchema.index({ reviewedUser: 1, home: 1 });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// This will select allthe reviews that was pass in as the arguement(User)
reviewSchema.statics.calcAverageRatings = async function (userId, homeId) {
  console.log(userId);
  console.log(homeId);

  if (userId !== null && userId !== undefined) {
    const stats = await this.aggregate([
      {
        $match: { reviewedUser: userId },
      },
      {
        $group: {
          _id: '$reviewedUser', // All Users
          nRating: { $sum: 1 }, // Sum all Ratings
          avgRating: { $avg: '$rating' }, // The $avg operator will get the average of all Rating
        },
      },
    ]);

    if (stats.length > 0) {
      await User.findByIdAndUpdate(userId, {
        ratingsQuantity: stats[0].nRating,
        averageRating: stats[0].avgRating,
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        ratingsQuantity: 0,
      });
    }
  }
  if (homeId !== null && homeId !== undefined) {
    const stats = await this.aggregate([
      {
        $match: { reviewedHome: homeId },
      },
      {
        $group: {
          _id: '$reviewedHome', // All homes
          nRating: { $sum: 1 }, // Sum all Ratings
          avgRating: { $avg: '$rating' }, // The $avg operator will get the average of all Rating
        },
      },
    ]);

    if (stats.length > 0) {
      await Home.findByIdAndUpdate(homeId, {
        ratingsQuantity: stats[0].nRating,
        averageRating: stats[0].avgRating,
      });
    } else {
      await Home.findByIdAndUpdate(homeId, {
        ratingsQuantity: 0,
      });
    }
  }
};

reviewSchema.post('save', function () {
  //this points to current review

  this.constructor.calcAverageRatings(this.reviewedUser, this.reviewedHome);
  // next();
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  //console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
  await this.r.constructor.calcAverageRatings(
    this.r.reviewedUser,
    this.r.reviewedHome
  );
});

const Review = mongoose.model('testReview', reviewSchema);

module.exports = Review;

// testUserSchema.post('save', function () {
//     //this points to current review

//     this.constructor.calcDataQuality(this.testUser);
// });
