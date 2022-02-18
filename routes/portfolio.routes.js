const router = require("express").Router();

const mongoose = require("mongoose");

const Portfolio = require("../models/Portfolio.model.js");
const Asset = require("../models/Asset.model.js");
const User = require("../models/User.model.js");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// Routes

router.get("/create", (req, res) => {
  res.render("../views/portfolio/create.hbs");
});

router.post('/create', (req, res) => {
  const userId = req.params;

  const { name, currency } = req.body;

  // Check if everything is filled by user
  /* if (!name) {
    return res
      .status(400)
      .render("portfoltio/create", { errorMessage: {name: "Please give a name to your portfolio."}, form:{ name, currency }});
  } */

  // If everything good
  /* Portfolio.findOne({ userId })
    if (found && name === Portfolio.name) {
      return res
        .status(400)
        .render("portfoltio/create", { errorMessage: {name: "You already gave this name to another portfolio. Please choose another one."}, form:{ name, currency }});;
    }  */
  
  Portfolio.create({
    name,
    assets: [],
    user: userId,
    currency
  
  })
  .then(portfolio => {
    console.log(portfolio);
    res.redirect('/portfolio/portfolio');
  })
  
  .catch(err => console.log(err));

  /* User.findOne({ userId }).then((found) => {
    if (!found) {
      return res
        .statut(400)
        .render("auth/signin", { errorMessage: "Sign in to create again to create a portfolio" })
    }

    Portfolio.create({
        name,
        assets: [],
        user: userId,
        currency
    });

    return res
      .then(portfolio => {
          console.log(portfolio);
          res.redirect('/:portfolioId');
      })

    .catch(err => console.log(err));
  });
 */
}); 

router.get('/portfolio/:portfolioId', (req, res, next) => {
  const portfolioId = req.params;

  Portfolio.findOne({portfolioId})
    .then(portfolio => {
        console.log(portfolio)
        res.render('portfolio/portfolio',{portfolio})
    })
    .catch(err => console.log(err));
}); 

router.get('/portfolio/:portfolioId/coins/:coinId', (req, res) => {
  res.render('assets/asset');
}); 

// Module export

module.exports = router;