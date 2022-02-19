const router = require("express").Router();

const mongoose = require("mongoose");

const Portfolio = require("../models/Portfolio.model.js");
const Asset = require("../models/Asset.model.js");
const User = require("../models/User.model.js");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// Routes
const generatePortfolioId = (name) => {
  return name.replace(/\s+/g, '-').toLowerCase();
}

router.get("/create", (req, res) => {
  res.render("portfolio/create");
});

router.post('/create', (req, res) => {
  
  const user = req.session.user.id;
  const { name, currency } = req.body;

  // Check if everything is filled by user
  if (!name) {
    return res.status(400).render("portfoltio/create", { error: {message: "Please give a name to your portfolio."}, form:{ name, currency }});
  } 

  // If everything good
  Portfolio.findOne({ id: generatePortfolioId(name) })
  .then(folio =>{
    if (folio && generatePortfolioId(folio.name) === generatePortfolioId(name)) {
      return res
      .status(400)
      .render("portfolio/create", { error: {message: "You already gave this name to another portfolio. Please choose another one."}, form:{ name, currency }});
    } 
    
    Portfolio.create({ id:generatePortfolioId(name),name,value:0,assets:[],user,currency })
    .then(portfolio => {
      console.log(portfolio);
      res.redirect(`/portfolio/${portfolio.id}`);
    })
    .catch(err => console.log(err));
  }) 
});

router.get('/:portfolioId', (req, res, next) => {
  const portfolioId = req.params;

  Portfolio.findOne({portfolioId})
    .then(portfolio => {
        res.render('portfolio/portfolio',{portfolio})
    })
    .catch(err => console.log(err));
}); 

router.get('/portfolio/:portfolioId/coins/:coinId', (req, res) => {
  res.render('assets/asset');
}); 

// Module export

module.exports = router;