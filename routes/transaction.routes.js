const router = require("express").Router();

const mongoose = require("mongoose");

const Portfolio = require("../models/Portfolio.model.js");
const Asset = require("../models/Asset.model.js");
const User = require("../models/User.model.js");
const Transaction = require("../models/Transaction.model.js");
const Coin = require("../models/Coin.model.js");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// Routes
router.get('/new', (req, res) => {
    res.render('/transactions/create');
}); 


router.post('/new', (req, res) => {
    const { coinId, PortfolioId } = req.params;
    const user = req.session.user.id;
    const {price, currency, amount, total, transactionType, note, created} = req.body; 

    //check if asset already in user's portfolio

    async function findIfAlreadyHere(user, coinId) {
        const result = await client.db("coinbutter").collection("porfolio").findOne({ user: user, assets:coinId });
        
        if (!result) {
            client.db("coinbutter").collection("porfolio").insertOne()({ assets:coinId })
        }
    }

    Portfolio.findById(PortfolioId) {
        .then(folio =>{
            folio.assets.create({ coinId })
        })
    }
}); 

router.post('/', (req, res) => {

    
  }); 

// Module export

module.exports = router;