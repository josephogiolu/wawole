const mongoose = require('mongoose');

const homeTourSchema = new mongoose.Schema({
    tourDate: {
        type: Date,
        required: true,
    },
    homeId: {
        type: 'ObjectId',
        ref: 'Home',
        required: true,
    },
},
{
    timestamps: {
      createdAt: 'homeTourCreatedAt',
      updatedAt: 'homeTourModifiedAt',
}, 
},
);

const HomeTour = mongoose.model('HomeTour', homeTourSchema);
module.exports = {HomeTour, homeTourSchema};