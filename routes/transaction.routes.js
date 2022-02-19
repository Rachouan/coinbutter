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

    // Check if asset already in user's portfolio and update or create

    async function findIfAlreadyHere(coinId, portfolioId) {
        const result = await Asset.findOne({ coin:coinId, portfolioId: portfolioId });
        
        if (result) {
            Asset.findOneAndUpdate({
                coin:           coinId, 
                portfolioId:    portfolioId
            }, 
            {
                quantity:       quantity+amount, 
                $push:{
                    transaction:{
                        price:          price, 
                        currency:       currency, 
                        amount:         amount, 
                        total:          total, 
                        transactionType:transactionType, 
                        note:           note, 
                        created:        created
                    }
                }
            })
        } else {
            Asset.create({
                coin:           coinId, 
                portfolioId:    portfolioId, 
                transaction:{
                    price:          price, 
                    currency:       currency, 
                    amount:         amount, 
                    total:          total, 
                    transactionType:transactionType, 
                    note:           note, 
                    created:        created
                }
            })
            
        } return res
            .redirect(`/portfolio/${portfolioId}`)
    }
});




router.post('/', (req, res) => {}); 

// Module export

module.exports = router;