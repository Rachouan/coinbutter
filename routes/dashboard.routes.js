const router = require("express").Router();

const Coin = require("../models/Coin.model.js");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {
  Coin.find()
  .then(coins => {
    console.log(coins);
    res.render("dashboard",{coins});
  })
  .catch(err => console.log(err));
});

module.exports = router;
