const mongoose = require('mongoose');

const favoriteShema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    campsites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campsite"
    }]
});

const Favorite = mongoose.model('Favorite', favoriteShema);

module.exports = Favorite;