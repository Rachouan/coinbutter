const router = require("express").Router();
const Asset = require("../models/Asset.model.js");
const axios = require("axios");
const helper = require("../helpers/helpers.js");
const Portfolio = require("../models/Portfolio.model.js");


router.get("/portfolio/:portfolioId/asset/:assetId", (req, res, next) => {
    const {assetId} = req.params
    const {portfolioId} = req.params

    let portfolioTotal = 0;
    let assetValue = 0;
    let totalAmount = 0;
    let percentage = 0;
    let denominator = 0;
    let numerator = 0;
    let avgBuyPrice = 0;

    Asset.findOne({id:assetId})
    .populate('coin transactions portfolioId')
    .then(asset => {
        //console.log(asset.transactions[0].price);
        asset.coin.total_value = helper.amountFormatter(asset.amount * asset.coin.current_price);
        assetValue = asset.coin.total_value;

        // Avg Buying Price
        for (let i=0; i<asset.transactions.length; i++){
            denominator =+ asset.transactions[i].amount * asset.transactions[i].price;
            numerator =+ asset.transactions[i].amount;
        }
        avgBuyPrice = denominator / numerator;

        // Total PnL
        let pnl = asset.coin.total_value - (avgBuyPrice * asset.amount);
        console.log(pnl)

        res.render('assets/asset',{coin:asset.coin,transactions:asset.transactions,portfolio:asset.portfolioId,percentage:percentage, totalAmount:totalAmount, avgBuyPrice: avgBuyPrice}) 
    })
    .then(Portfolio.findById(portfolioId)               // % Holdings
            .populate({
                path : 'assets',
                populate : {
                path : 'coin'
                }
            })
            .then(folio => {
                portfolioTotal = folio.assets.reduce((a,b) => a + b.amount * b.coin.current_price ,0);
                totalAmount = folio.amount;
            })
    )
    .catch(err => {
        console.log('Error',err);
        res.json(err)
    })

});

module.exports = router;
