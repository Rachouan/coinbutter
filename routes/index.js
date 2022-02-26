const router = require("express").Router();
const Coin = require("../models/Coin.model.js");

/* GET home page */
router.get("/", (req, res, next) => {
  
  (async () => {
    try {
        const coins = await Coin.find().sort('market_cap_rank').limit(4)
        res.render("index",{coins});
        
    } catch (error) {
        console.error(error);
        res.status(500).render("index");
    }
  })();

});

module.exports = router;
