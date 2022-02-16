const router = require("express").Router();

const mongoose = require("mongoose");

const Asset = require("../models/Asset.model.js");
const MarketStat = require("../models/Asset.model.js")

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// Routes 
router.get('/assets', (req, res, next) => {
  res.render('assets.hbs');
});

/* router.get('/assets/:coinId', (req, res) => {
  res.render('../views/assets/coin.hbs');
}); */

module.exports = router;