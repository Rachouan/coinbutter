const router = require("express").Router();

const mongoose = require("mongoose");

const Portfolio = require("../models/Portfolio.model.js");
const Asset = require("../models/Asset.model.js");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

 router.get('/:portfolioId', (req, res) => {
  res.render('portfolio/portfolio');
}); 

router.get('/:portfolioId/coins/:coinId', (req, res) => {
  res.render('assets/asset');
}); 
module.exports = router;