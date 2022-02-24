const router = require("express").Router();
const Asset = require("../models/Asset.model.js");
const axios = require("axios");
const helper = require("../helpers/helpers.js");
const Portfolio = require("../models/Portfolio.model.js");


router.get("/portfolio/:portfolioId/asset/:assetId", (req, res, next) => {
    const {assetId} = req.params
    const {portfolioId} = req.params

    /* let totalAssetValue = 0; */
    let portfolioTotal = 0;
    let assetAmount = 0;
    let percentage = 0;

    Asset.findOne({id:assetId})
    .populate('coin transactions portfolioId')
    .then(Portfolio.findById(portfolioId)               // % Holdings
            .populate({
                path : 'assets',
                populate : {
                path : 'coin'
                }
            })
            .then(folio => {
                portfolioTotal = folio.assets.reduce((a,b) => a + b.amount * b.coin.current_price ,0);
                percentage = (100 * assetAmount) / portfolioTotal;
                console.log(assetAmount);
            })
            .catch(err => console.log(err))
    )
    .then(asset => {
        //console.log(asset.amount, asset.coin);
        asset.coin.total_value = helper.amountFormatter(asset.amount * asset.coin.current_price);
        assetAmount = asset.coin.total_value;
        res.render('assets/asset',{coin:asset.coin,transactions:asset.transactions,portfolio:asset.portfolioId}) 
    })
    .catch(err => {
        console.log('Error',err);
        res.json(err)
    })

});

module.exports = router;
