const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { subscriptionSchema } = require('./subscriptionModel');
const { addressSchema } = require('./addressModel');
const { paymentInfoSchema } = require('./paymentInfoModel');

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      //required: [true, 'Please provide email'],
      validate: [validator.isEmail, 'Please provide a valid email'],
      unique: true,
    },
    primaryEmail: {
      type: String,
      //required: [true, 'Please provide email'],
      validate: [validator.isEmail, 'Please provide a valid email'],
      unique: true,
    },
    displayName: {
      type: String,
      maxlength: 20,
    },
    homeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Home',
    },
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      maxlength: 50,
      minlength: 3,
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      maxlength: 50,
      minlength: 3,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Others'],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 8,
      //select: false,
    },
    passwordConfirm: {
      type: String,
      minlength: 8,
      required: true,
      validate: {
        validator: function (val) {
          // this only works on SAVE!!! and CREATE
          return val === this.password;
        },
        message: 'password and passwordConfirm must be same',
      },
      select: false,
    },
    primaryPhone: {
      type: String,
      max: 15,
      min: 8,
      required: true,
    },
    secondaryPhone: {
      // This Field was added by me
      type: String,
      min: 8,
      max: 15
    },
    photo: {
      type: String,
    },
    dateOfBirth: Date,
    officeEmail: {
      type: String,
      //required: [true, 'Please provide office email'],
      validate: [validator.isEmail, 'Please provide valid email'],
    },
    addresses: {
      type: [addressSchema],
      default: undefined,
    },
    paymentInfo: {
      type: [paymentInfoSchema],
      default: undefined,
    },
    country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    localGovt: {
      type: String,
      trim: true,
    },
    tribe: {
      type: String,
      trim: true,
    },
    userSummary: {
      type: String,
      trim: true,
    },
    role: 
      {
        type: [String],
        enum: ['user', 'tenant', 'landlord', 'agent', 'admin'],
        default: 'user',
      },

    dataQuality: {
      type: Number,
      default: 1,
    },
    averageRating: {
      type: Number,
      //default: 0.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      // Added this field. This field is for total count or number of review
      type: Number,
      default: 0,
    },
    subscription: {
      type: subscriptionSchema,
      required: false,
    },
    userStatus: {
      type: String,
      enum: ['Active', 'Temporary', 'Oauth'],
      default: 'Temporary',
    },
    userType: {
      type: String,
      enum: ['Regular', 'Oauth'],
      required: true,
    },
    photoId: {
      type: String,
    },
    validateToken: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: 'userCreatedAt',
      updatedAt: 'userModifiedAt',
    },
  }
);

// From my observation, The calculation of the averageRating filed was done in the ReviewsModel because the actual rating is in ReviewModel

userSchema.index({ location: '2dsphere' });

userSchema.methods.myPopulated = function (...fields) {
  let setPopulated = true;
  fields.forEach((el) => {
    if (el === undefined || el === null) setPopulated = false;
  });
  return setPopulated;
};
userSchema.statics.calcDataQuality = async function (doc, updates) {
  if (doc.myPopulated(doc.dateOfBirth, doc.secondaryPhone, doc.addresses)) {
    //console.log(updates);
    doc.dataQuality = 2;
  }
  if (updates !== undefined) {
    if (
      doc.myPopulated(
        updates.dateOfBirth,
        updates.secondaryPhone,
        updates.addresses
      )
    )
      updates.dataQuality = 2;
  }

  if (doc.myPopulated(doc.officeEmail, doc.addresses)) {
    doc.dataQuality = 3;
  }
  if (updates !== undefined) {
    if (doc.myPopulated(updates.officeEmail, updates.addresses))
      updates.dataQuality = 3;
  }
  if (doc.myPopulated(doc.country, doc.state, doc.tribe, doc.localGovt)) {
    doc.dataQuality = 4;
  }
  if (updates !== undefined) {
    if (
      doc.myPopulated(
        updates.country,
        updates.state,
        updates.tribe,
        updates.localGovt
      )
    )
      updates.dataQuality = 4;
  }
  if (doc.myPopulated(doc.userSummary, doc.photo)) {
    doc.dataQuality = 5;
  }
  if (updates !== undefined) {
    if (doc.myPopulated(updates.userSummary, updates.photo))
      updates.dataQuality = 5;
  }
};

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);

  // delete the password confirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', function (next) {
  // Only run this function if password was actually modified
  if (this.isNew && this.userType !== 'Oauth') this.createValidationToken();
  next();
});

userSchema.pre('save', function (next) {
  this.constructor.calcDataQuality(this);
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query object
  this.find({ active: { $ne: false } });
  next();
});

// Added for calculating dataQaulity during updates
userSchema.pre('findOneAndUpdate', async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  docToUpdate.constructor.calcDataQuality(docToUpdate, this._update);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createValidationToken = function () {
  const validToken = crypto.randomBytes(32).toString('hex');
  this.validateToken = crypto
    .createHash('sha256')
    .update(validToken)
    .digest('hex');

  console.log({ validToken }, this.validateToken);

  return this.validateToken;
};
const users = mongoose.model('testUsers', userSchema);

module.exports = users;

// moved comments to end of file
// userSchema.aggregate([
//   { $lookup:
//       {
//          from: "Home",
//          localField: "_id",
//          foreignField: "Home",
//          as: "Home"
//       }
//   }
// ]).pretty();

// Virtual populate
/* userSchema.virtual('reviews', {
  ref: 'testReview',
  foreignField: 'reviewedUser',
  localField: '_id',
}); */

/* userSchema.post('save', function () {
  //this.constructor.calcDataQuality(this);
  // console.log('Postsave Dataquality called');
}); */

/* userSchema.post('findOneAndUpdate', async function (next) {
  
  //next();
}); */
