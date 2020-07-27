const express = require('express');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors'); 

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find()
    .populate('user campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then((favorite) => {
      if (!favorite) {
        Favorite.create({ user: req.user._id, campsites: req.body }).then(
          (favorite) => {
            res.status(200).json(favorite);
          }
        );
      }
      req.body.campsites.map((fav) => {
        if (!favorite.campsites.includes(fav._id)) {
          favorite.campsites.push(fav);
        }
      });
      favorite.save().then((favorite) => {
        res.status = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      });
    })
    .catch((error) => {
      return next(error);
    }); 
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneandDelete({ user: req.user._id })
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then((favorite) => {
      if (!favorite) {
        Favorite.create({
          user: req.user._id,
          campsites: [{ _id: req.params.campsiteId }],
        }).then((favorite) => {
          res.status = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        });
      } else if (!favorite.campsites.includes(req.params.campsiteId)) {
        favorite.campsites.push(req.params.campsiteId);
        favorite.save().then((favorite) => {
          res.status = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorite);
        });
      } else {
        res.send("Campsite already favorited");
      }
    })
    .catch((error) => next(error));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
        if (!favorite) {
          res.end("favorite not found");
        }
        const campsites = favorite.campsites.filter(
          (favorite) => !favorite.equals(req.params.campsiteId)
        );
        favorite.campsites = campsites;
        favorite.save().then((favorite) => {
          res.json(favorite);
        });
});

module.exports = favoriteRouter;