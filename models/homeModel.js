const mongoose = require('mongoose');
const { priceSchema } = require('./priceModel');

const homeSchema = new mongoose.Schema(
  {
    landlordId: {
      type: 'ObjectId',
      ref: 'User',
      required: [true, 'Provide your UserID'],
    },
    //[

    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
        required: true,
      },
      coordinates: [Number],
      address: String,
      //description: String,
    },
    //],
    homeType: {
      type: String,
      required: [true, 'Specify the type of your home'],
      enum: [
        'Bungalow',
        'Cottage',
        'Terraced house',
        'Ranch-Style house',
        'Duplex',
        'Igloo',
        'Mansion',
        'Flat'
      ],
    },
    photos: {
      type: [String],
    },
    photoIDPath: {
      type: [String],
    },

    description: {
      type: String,
    },
    price: {
      type: priceSchema,
    },
    numOfBathrooms: {
      type: Number,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    numOfToilets: {
      type: Number,
    },
    roomsEnsuite: {
      type: Boolean,
    },

    numOfRooms: {
      type: Number,
      min: 1,
    },
    roomsWithWardrobes: {
      type: Number,
    },
    kitchenCarbinet: {
      type: Boolean,
    },
    hasStore: {
      type: Boolean,
    },
    popCeiling: {
      type: Boolean,
    },
    numberOfParking: {
      type: Number,
    },
    numberInBuilding: {
      type: Number,
    },
    landLordResident: {
      type: Boolean,
    },
    numOfExits: {
      type: Number,
    },
    buildingInEstate: {
      type: Boolean,
    },
    gatedCommunity: {
      type: Boolean,
    },
    prepaidMeter: {
      type: Boolean,
    },
    waterSource: {
      type: String,
      enum: ['Borehole', 'Well', 'Government Water'],
    },
    buildingType: {
      type: String,
      enum: ['Renovated', 'New', 'Old'],
      required: true,
    },
    roadNetwork: {
      type: String,
      enum: ['Concrete', 'Tarred', 'Paved'],
    },
    petsAllowed: {
      type: Boolean,
    },
    rentID: {
      type: 'ObjectID',
      ref: 'Rents',
    },
    status: {
      type: String,
      enum: ['Published', 'Unpublished', 'Withdrawn'],
      default: 'Unpublished',
    },
    rented: {
      type: Boolean,
      default: false,
    },
    premiumList: {
      type: Boolean,
    },
    averageRating: {
      type: Number,
      //default: 0.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    dataQuality: {
      type: Number,
    },

    amenities: {
      type: [String],
      trim: true,
    },
    createdBy: {
      type: 'ObjectId',
      ref: 'Users',
    },
    modifiedBy: {
      type: 'ObjectID',
      ref: 'Users',
    },
    validatedBy: {
      type: 'ObjectID',
      ref: 'Users',
    },
    validatedOn: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'modifiedAt',
    },
  }
  //When you enable timestamps, Mongoose adds createdAt and updatedAt properties to your schema.
);
homeSchema.index({ location: '2dsphere' });
homeSchema.methods.myPopulated = function (...fields) {
  let setPopulated = true;
  fields.forEach((el) => {
    if (el === undefined || el === null) setPopulated = false;
  });
  return setPopulated;
};
// Fixes calcDataQuality for Updates
homeSchema.statics.calcDataQuality = async function (doc, updates) {
  if (doc.myPopulated(doc.homeType, doc.price, doc.description)) {
    doc.dataQuality = 1;
  }
  if (updates !== undefined) {
    if (doc.myPopulated(updates.homeType, updates.price, updates.description))
      updates.dataQuality = 1;
  }

  if ((doc.numOfBathrooms, doc.numOfToilets, doc.buildingType)) {
    doc.dataQuality = 2;
  }
  if (updates !== undefined) {
    if (
      doc.myPopulated(
        updates.numOfBathrooms,
        updates.numOfToilets,
        updates.buildingType
      )
    )
      updates.dataQuality = 2;
  }
  if (
    doc.myPopulated(
      doc.roomsEnsuite,
      doc.roomsWithWardrobes,
      doc.kitchenCarbinet,
      doc.photos,
      doc.prepaidMeter
    )
  ) {
    doc.dataQuality = 3;
  }
  if (updates !== undefined) {
    if (
      doc.myPopulated(
        doc.roomsEnsuite,
        updates.roomsWithWardrobes,
        updates.kitchenCarbinet,
        updates.photos,
        updates.prepaIdMeter
      )
    )
      updates.dataQuality = 3;
  }
  if (
    doc.myPopulated(
      doc.petsAllowed,
      doc.landLordResident,
      doc.numOfExits,
      doc.numberInBuilding
    )
  ) {
    doc.dataQuality = 4;
  }
  if (updates !== undefined) {
    if (
      doc.myPopulated(
        updates.petsAllowed,
        updates.landLordResident,
        updates.numOfExits,
        updates.numberInBuilding
      )
    )
      updates.dataQuality = 4;
  }
  if (
    doc.myPopulated(
      doc.published,
      doc.waterSource,
      doc.amenities,
      doc.gatedCommunity,
      doc.buildingInEstate
    )
  ) {
    doc.dataQuality = 5;
  }
  if (updates !== undefined) {
    if (
      doc.myPopulated(
        updates.published,
        updates.waterSource,
        updates.amenities,
        updates.gatedCommunity,
        updates.buildingInEstate
      )
    )
      updates.dataQuality = 5;
  }
};

homeSchema.pre('save', function (next) {
  this.constructor.calcDataQuality(this);
  next();
});

homeSchema.pre('findOneAndUpdate', async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  docToUpdate.constructor.calcDataQuality(docToUpdate, this._update);
  next();
});
const Home = mongoose.model('Home', homeSchema);
module.exports = Home;
