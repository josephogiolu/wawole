const mongoose = require('mongoose');
const User = require('./userModel');

// review user - tour reviewd - review text - createdAt - rating
const reviewHomeSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      minlength: [3, 'reviews must be 15 or more characters long.'],
      maxlength: [255, 'reviews must be 255 or less characters long.'],
      required: [true, 'review must have a text associated.'],
      trim: true
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
    reviewObject: {
        type: String,
        enum: ['User', 'Landlord', 'Tenant', 'Home', 'Environment', 'Agent'],
        required: true
      },
    reviewedHome: {
        type: mongoose.Schema.ObjectId,
        ref: 'Home',
        required: [true, 'review must belong to a user.']
      },
  },
  {
    timestamps: true,
  }
);


// A user cant have multiple rating per who or what they want to rate or review
//reviewSchema.index({ reviewedUser: 1, reviewedUser: 1, home: 1, user: 1 }, { unique: true });

reviewHomeSchema.pre(/^find/, function (next) {
  this.populate({
      path: 'user',
      select: 'name photo',
    });

  next();
});

// This will select allthe reviews that was pass in as the arguement(User)
reviewHomeSchema.statics.calcAverageRatings = async function (homeId) {

    const stats = await this.aggregate([
    {
       
      $match: { reviewedHome: homeId },
    },
    {
      $group: {
        _id: '$user', // All Users
        nRating: { $sum: 1 }, // Sum all Ratings 
        avgRating: { $avg: '$rating' } // The $avg operator will get the average of all Rating
      },
    },
  ]);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(homeId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await User.findByIdAndUpdate(homeId, {
      ratingsQuantity: 0,
      ratingsAverage: 0.5
    });
  }
};

reviewHomeSchema.post('save', function () {
  //this points to current review

  this.constructor.calcAverageRatings(this.reviewedHome);
  // next();
});

reviewHomeSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  //console.log(this.r);
  next();
});

reviewHomeSchema.post(/^findOneAnd/, async function (next) {
  await this.r.constructor.calcAverageRatings(this.r.reviewedHome);
});

const Review = mongoose.model('reviewHome', reviewHomeSchema);

module.exports = Review;

// testUserSchema.post('save', function () {
//     //this points to current review
  
//     this.constructor.calcDataQuality(this.testUser);
// });