const router = require("express").Router();
const Asset = require("../models/Asset.model.js");
const axios = require("axios");

console.log(`Assets routes`)

router.get("portfolio/:portfolioId/asset/:assetId", (req, res, next) => {
    const {assetId} = req.params

    Asset.findOne({id:assetId})
    .then(asset => {
        console.log(asset)
        res.json(asset);
        //res.render('assets/asset',{coin:Asset.coin})
    })
    .catch(err => res.json(err));
    
});

module.exports = router;
