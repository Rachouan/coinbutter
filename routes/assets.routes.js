const router = require("express").Router();
const axios = require("axios");
const helper = require("../helpers/helpers.js");

const Portfolio = require("../models/Portfolio.model.js");
const Asset = require("../models/Asset.model.js");
const Transaction = require("../models/Transaction.model.js");


router.get("/portfolio/:portfolioId/asset/:assetId", (req, res, next) => {
    


    ( async () =>{

        const {assetId} = req.params;
        const {portfolioId} = req.params;

        try{
            const asset = await Asset.findOne({id:assetId}).populate('coin transactions portfolioId');
            const portfolio = await Portfolio.findById(portfolioId).populate('assets');

            let total = 0;
            let num = 0;

            // % holdings
            //asset.percentage = (asset.amount * asset.coin.current_price * 100) / ;
            
            // Avg Buy Price
            asset.transactions.forEach(transaction => {
                if(transaction.transactionType === 'buy'){
                    total += transaction.amount * transaction.price;
                    num += transaction.amount;
                }
            });

            asset.avgBuyPrice = total / num;
            console.log(asset.avgBuyPrice);

            // Total PnL
            asset.pnl = asset.coin.current_price * asset.amount - (asset.avgBuyPrice * asset.amount);

            //res.render('assets/asset',{asset})
            res.json(asset.avgBuyPrice);
        }catch(err){
            res.json(err);
        }

        

        // let transactions = await Transaction.find({asset:assetId, transactionType:"buy"})
        // let asset = await Asset.findById(assetId)

        // // Total PnL
        // pnl = asset.coin.total_value - (avgBuyPrice * asset.amount);
        // console.log(denominator)

        // // % holdings
        // asset.percentage = helper.round(assetValue * 100 / totalAmount);

    })();

    


    // Avg Buying Price
    /* for (let i=0; i<asset.transactions.length; i++){
        denominator =+ asset.transactions[i].amount * asset.transactions[i].price;
        numerator =+ asset.transactions[i].amount;
    }
    asset.avg_buy_price = denominator / numerator;
    console.log(numerator)

    // Total PnL
    pnl = asset.coin.total_value - (avgBuyPrice * asset.amount);
    console.log(denominator) */
    

});

module.exports = router;
