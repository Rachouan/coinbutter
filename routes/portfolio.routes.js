const router = require("express").Router();

const mongoose = require("mongoose");

const Portfolio = require("../models/Portfolio.model.js");
const Asset = require("../models/Asset.model.js");
const User = require("../models/User.model.js");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const helper = require("../helpers/helpers.js");
// Routes

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
  Portfolio.findOne({ id: helper.concatString(name) })
  .then(folio =>{
    if (folio && helper.concatString(folio.name) === helper.concatString(name)) {
      return res
      .status(400)
      .render("portfolio/create", { error: {message: "You already gave this name to another portfolio. Please choose another one."}, form:{ name, currency }});
    } 
    
    Portfolio.create({ id:helper.concatString(name),name,value:0,assets:[],user,currency })
    .then(portfolio => {
      console.log(portfolio);
      res.redirect(`/portfolio/${portfolio._id}`);
    })
    .catch(err => console.log(err));
  }) 
});

router.get('/:portfolioId', (req, res, next) => {
  const {portfolioId} = req.params;
  
  
  Portfolio.findOne({_id:portfolioId})
    .populate({
      path : 'assets',
      populate : {
        path : 'coin'
      }
    })
    .then(portfolio => {
        let amount = 0;

        let portfolioTotal = portfolio.assets.reduce((a,b) => {
          amount = b.amount * b.coin.current_price;
          b.totalAmount =  helper.amountFormatter(amount);
          return a + amount;
        } ,0);
        portfolio.total = helper.amountFormatter(portfolioTotal);
        res.render('portfolio/portfolio',{portfolio})
    })
    .catch(err => console.log(err));
}); 

router.get('/portfolio/:portfolioId/asset/:coinId', (req, res) => {
  res.render('assets/asset');
}); 

// Module export

module.exports = router;