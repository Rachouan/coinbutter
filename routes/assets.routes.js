const router = require("express").Router();
const Asset = require("../models/Asset.model.js");
const axios = require("axios");
const helper = require("../helpers/helpers.js");
const Portfolio = require("../models/Portfolio.model.js");


router.get("/portfolio/:portfolioId/asset/:assetId", (req, res, next) => {
    const {assetId} = req.params
    const {portfolioId} = req.params

    /* let totalAssetValue = 0; */
    /* let portfolioTotal = 0; */

    let porfolio = Portfolio.findById(portfolioId);
    console.log(porfolio.asset)

    Asset.findOne({id:assetId})
    .populate('coin transactions portfolioId')
    .then(asset => {
        //console.log(asset.amount, asset.coin);
        asset.coin.total_value = helper.amountFormatter(asset.amount * asset.coin.current_price);
        res.render('assets/asset',{coin:asset.coin,transactions:asset.transactions,portfolio:asset.portfolioId}) 
    })
    .catch(err => {
        console.log('Error',err);
        res.json(err)
    })

// Assets Stats
    // Calculate % of Holdings

    /* async function getAssetDatas(){
        const portfolio = Portfolio.findById(portfolioId);
        const asset = Assets.findById(assetId);

    } */
    /* Portfolio.findById(portfolioId)
    .populate({
        path : 'assets',
        populate : {
        path : 'coin'
        }
    })
    .then(folio => {
        folio.assets.reduce((a,b) => {
            console.log(a, b);
            portfolioTotal = b.amount * b.coin.current_price;
            b.totalAmount =  helper.amountFormatter(portfolioTotal);
            portfolioTotal =+ a;
        } ,0);
        folio.total = helper.amountFormatter(portfolioTotal);
        console.log(portfolioTotal)
    }) */
});

module.exports = router;
