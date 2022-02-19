const router = require("express").Router();

const Coin = require("../models/Coin.model.js");
const Portfolio = require("../models/Portfolio.model.js");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {

  async function getDashboardData(){
    try {
        const coins = await Coin.find()
        const portfolios = await Portfolio.find()
        await Promise.all(coins,portfolios);
        res.render("dashboard",{coins,portfolios});
    } catch (error) {
        console.error(error);
    }
  }
  getDashboardData();
  
});

module.exports = router;
