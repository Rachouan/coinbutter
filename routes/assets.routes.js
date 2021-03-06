const router = require("express").Router();
const axios = require("axios");
const helper = require("../helpers/helpers.js");

const Portfolio = require("../models/Portfolio.model.js");
const Asset = require("../models/Asset.model.js");


router.get("/portfolio/:portfolioId/asset/:assetId", (req, res, next) => {
    


    ( async () =>{

        const {assetId} = req.params;
        const {portfolioId} = req.params;

        try{
            const asset = await Asset.findOne({_id:assetId,portfolioId:portfolioId}).populate('coin transactions portfolioId');
            const portfolio = await Portfolio.findById(portfolioId).populate({
                path : 'assets',
                populate : {
                  path : 'coin'
                }
            });

            console.log(asset);

            let amount = 0;
            let total = 0;
            let num = 0;

            asset.value = asset.amount * asset.coin.current_price;

            // % holdings
            portfolio.total = portfolio.assets.reduce((a,b) => {
                amount = b.amount * b.coin.current_price;
                b.totalAmount =  helper.amountFormatter(amount);
                return a + amount;
            } ,0);
            asset.percentage = (asset.value * 100) / portfolio.total;

            // Avg Buy Price
            asset.transactions.forEach(transaction => {
                if(transaction.transactionType === 'buy'){
                    total += transaction.amount * transaction.price;
                    num += transaction.amount;
                }
            });
            asset.avgBuyPrice = total / num;

            // Total PnL
            asset.pnl = asset.coin.current_price * asset.amount - (asset.avgBuyPrice * asset.amount);

            res.render('assets/asset',{asset,portfolio,coin:asset.coin,transactions:asset.transactions})
            //res.json(asset);
            //res.json(asset.percentage);
            
        }catch(err){
            res.json(err);
        }
    })();
});

router.post("/portfolio/:portfolioId/asset/:assetId/delete", (req, res, next) => {
    
    ( async () =>{

        const {assetId} = req.params;
        const {portfolioId} = req.params;

        if(!assetId && portfolioId) return res.redirect(`/portfolio/${portfolioId}`);
        if(!assetId && !portfolioId) return res.redirect(`/portfolio/${portfolioId}`);

        try{
            await Asset.findOneAndDelete({_id:assetId, portfolioId: portfolioId});
            res.redirect(`/portfolio/${portfolioId}`);
        }catch(err){
            res.redirect('/dashboard');
        }

    })();
});

module.exports = router;
