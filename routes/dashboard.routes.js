const router = require("express").Router();
const helper = require("../helpers/helpers.js");

const Coin = require("../models/Coin.model.js");
const Portfolio = require("../models/Portfolio.model.js");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {

  const user = req.session.user.id;

  async function getDashboardData(){
    try {
        const coins = await Coin.find()
        const portfolios = await Portfolio.find({user}).populate({
          path : 'assets',
          populate : {
            path : 'coin'
          }
        })
        await Promise.all(coins,portfolios);
        
        let total = 0;

        portfolios.forEach(portfolio => {
          let portfolioTotal = portfolio.assets.reduce((a,b) => a + b.amount * b.coin.current_price ,0);
          portfolio.total = helper.amountFormatter(portfolioTotal);
          total += portfolioTotal;
        })

        res.render("dashboard",{dashboard:{total},coins,portfolios});
        
    } catch (error) {
        console.error(error);
    }
  }
  getDashboardData();
  
});

module.exports = router;
