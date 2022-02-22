const router = require("express").Router();
const Asset = require("../models/Asset.model.js");
const axios = require("axios");
const helper = require("../helpers/helpers.js");


router.get("/portfolio/:portfolioId/asset/:assetId", (req, res, next) => {
    const {assetId} = req.params

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
    });
    
});

module.exports = router;
