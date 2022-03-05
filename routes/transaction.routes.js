const router = require("express").Router();

const mongoose = require("mongoose");

const Portfolio = require("../models/Portfolio.model.js");
const Asset = require("../models/Asset.model.js");
const User = require("../models/User.model.js");
const Transaction = require("../models/Transaction.model.js");
const Coin = require("../models/Coin.model.js");
const helper = require("../helpers/helpers.js");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");


router.get('/:portfolioId/transactions/create',isLoggedIn, (req, res) => {
    const {portfolioId} = req.params;
    Coin.find().sort('market_cap_rank')
    .then(coins => res.render('transactions/create',{portfolioId,coins}))
    .catch(err => console.log(err));
}); 


router.post('/:portfolioId/transactions/create',isLoggedIn, (req, res) => {

    ( async () => {

        const {portfolioId} = req.params;
        const user = req.session.user.id;
        const {price, currency, amount,coin, total, transactionType, note} = req.body; 
        let {created} = req.body;

        try{

            let asset = await Asset.findOne({ coin:coin, portfolioId: portfolioId }).populate('coin');

            let portfolio = await Portfolio.findById(portfolioId);
            console.log('Asset:',asset);
            
            if(!asset){
                console.log('Create New asset')
                asset = await Asset.create({coin,amount:0,portfolioId})
                //portfolio.assets.push(asset.id);
                await Portfolio.findOneAndUpdate({_id:portfolioId},{$push: { assets: asset.id  }});
                //await Portfolio.findOneAndUpdate({id:portfolioId},{assets:portfolio.assets});   
                console.log(portfolio);
            }

            created = !created? Date.now():created;
            
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

            const updatedAsset = await Asset.findOneAndUpdate({_id:asset.id},{$push: { transactions: transaction.id  }},{new:true}).populate('coin transactions');
            await helper.updateAssetAmount(updatedAsset);
            res.redirect(`/portfolio/${portfolio._id}`);

        }catch(err){
            console.log(err);
        }

    })();

    
});

// Edit

router.get('/:portfolioId/asset/:assetId/transactions/:transactionId/edit', (req, res) => {
    const {portfolioId, assetId, transactionId} = req.params;

    ( async () => {
        try{
            let coins = await Coin.find().sort('market_cap_rank')
            let transaction = await Transaction.findOne({_id:transactionId});
            transaction.price = transaction.total / transaction.amount; 
            res.render("transactions/edit", {portfolioId, assetId, transactionId, transaction, coins})
        }catch(err){
            res.redirect(`/portfolio/${portfolioId}/asset/${assetId}`);
        }
    })();
    
}); 

router.post('/:portfolioId/asset/:assetId/transactions/:transactionId/edit', (req, res) => {

    ( async () => {

        const {portfolioId, assetId, transactionId} = req.params;
        const {price, currency, amount, total, transactionType, note} = req.body; 
        let {created} = req.body;

        created = !created? Date.now():created;

        try{
            await Transaction.findOneAndUpdate({_id:transactionId},{price, currency, amount, total, transactionType, note, created});
            let asset = await Asset.findOne({_id:assetId}).populate('coin transactions');
            await helper.updateAssetAmount(asset);
            res.redirect(`/portfolio/${portfolioId}/asset/${assetId}`);

        }catch(err){
            console.log(err);
        }
    })()
});


router.post('/:portfolioId/asset/:assetId/transactions/:transactionId/delete',isLoggedIn, (req, res) => {

    ( async () => {

        const {portfolioId,assetId,transactionId} = req.params;

        try{
            console.log('DELETEING TRANSACTION');
            await Transaction.findOneAndDelete({_id:transactionId})
            const asset = await Asset.findOne({_id:assetId}).populate('coin transactions');
            console.log('Updating asset => ',asset.transactions.length);
            if(asset.transactions.length > 0) { 
                await helper.updateAssetAmount(asset);
                return res.redirect(`/portfolio/${portfolioId}/asset/${assetId}`);
            }
            
            await Asset.findOneAndDelete({_id:assetId});
            res.redirect(`/portfolio/${portfolioId}/`);

        }catch(err){
            console.log(err);
            res.redirect(`/portfolio/${portfolioId}/asset/${assetId}`);
        }
    })();
});

// Module export

module.exports = router;