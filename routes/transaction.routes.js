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
router.get('/:portfolioId/transactions/create',isLoggedIn, (req, res) => {
    const {portfolioId} = req.params;
    Coin.find().sort('market_cap_rank')
    .then(coins => res.render('transactions/create',{portfolioId,coins}))
    .catch(err => console.log(err));
    console.log('HELLO')
    
}); 


router.post('/:portfolioId/transactions/create',isLoggedIn, (req, res) => {

    ( async () => {

        const {portfolioId} = req.params;
        const user = req.session.user.id;
        const {price, currency, amount,coin, total, transactionType, note, created} = req.body; 

        try{

            let asset = await Asset.findOne({ coin:coin, portfolioId: portfolioId }).populate('coin');

            let portfolio = await Portfolio.findById(portfolioId);
            console.log('Asset:',asset);
            
            if(!asset){
                console.log('Create New asset')
                asset = await Asset.create({coin,amount:0,portfolioId})
                portfolio.assets.push(asset.id);
                await Portfolio.findOneAndUpdate({id:portfolio.id},portfolio);   
                console.log(portfolio);
            }
            
            const transaction = await Transaction.create({
                price:price, 
                currency:currency, 
                asset: asset.id,
                amount:amount, 
                total:total, 
                transactionType:transactionType, 
                note:note, 
                created:created
            })

            let newAmount = asset.amount;

            switch (transaction.transactionType) {
                case 'sell':
                    newAmount -= transaction.amount;
                    break;
                default :
                    newAmount += transaction.amount;
            }
            
            const updatedAsset = await Asset.findByIdAndUpdate(asset.id,
                {
                    amount:newAmount,
                    $push: { transactions: transaction.id  }
                }
            );
                
            console.log('updated Asset',updatedAsset);
            res.redirect(`/portfolio/${portfolio._id}`);

        }catch(err){
            res.json(err);
        }

    })();

    
});

// Module export

module.exports = router;