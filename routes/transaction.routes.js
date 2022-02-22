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
router.get('/:portfolioId/transactions/create', (req, res) => {
    const {portfolioId} = req.params;
    Coin.find()
    .then(coins => res.render('transactions/create',{portfolioId,coins}))
    .catch(err => console.log(err));
    console.log('HELLO')
    
}); 


router.post('/:portfolioId/transactions/create', (req, res) => {
    const {portfolioId} = req.params;
    const user = req.session.user.id;
    const {price, currency, amount,coin, total, transactionType, note, created} = req.body; 

    console.log({price, currency, amount,coin, total, transactionType, note, created});

    //console.log({ coin, portfolioId },{price, currency, amount, total, transactionType, note, created})
    // Check if asset already in user's portfolio and update or create

    async function findIfAlreadyHere() {

        let asset = await Asset.findOne({ coin:coin, portfolioId: portfolioId }).populate('coin');

        let portfolio = await Portfolio.findOne({_id: portfolioId });
        console.log('Portfolio:',portfolio);
        if(!asset){
            console.log('Create New assets')
            asset = await Asset.create({coin,amount,portfolioId})
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
                newAmount -= transaction.amount
                break;
            default :
                newAmount += transaction.amount
        }

        asset = await Asset.findOneAndUpdate({id:asset.id},
            {
                amount:newAmount,
                $push: { transactions: transaction.id  }
            }
        );

        res.redirect(`/portfolio/${portfolio._id}`);
        //res.json(asset);
        
    }
    findIfAlreadyHere();
});

// Module export

module.exports = router;