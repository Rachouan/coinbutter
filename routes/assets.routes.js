const router = require("express").Router();
const axios = require("axios");
const helper = require("../helpers/helpers.js");

const Portfolio = require("../models/Portfolio.model.js");
const Asset = require("../models/Asset.model.js");
const Transaction = require("../models/Transaction.model.js");


router.get("/portfolio/:portfolioId/asset/:assetId", (req, res, next) => {
    

    
    // .then(asset => {
    //     //console.log(asset.transactions[0].price);
    //     asset.coin.total_value = helper.amountFormatter(asset.amount * asset.coin.current_price);
    //     assetValue = asset.coin.total_value;

    //     res.render('assets/asset',{coin:asset.coin,transactions:asset.transactions,portfolio:asset.portfolioId,percentage:percentage, avgBuyPrice:avgBuyPrice, totalAmount:totalAmount, pnl:pnl}) 
    // })

    ( async () =>{

        const {assetId} = req.params;

        try{
            const asset = await Asset.findOne({id:assetId}).populate('coin transactions portfolioId');

            let total = 0;
            let num = 0;
            
            asset.transactions.forEach(transaction => {
                console.log(transaction);
                if(transaction.transactionType === 'buy'){
                    total += transaction.amount * transaction.price;
                    num += transaction.amount;
                }
            });

            asset.avgBuyPrice = total / num;
            res.render('assets/asset',{asset})
            //res.json(asset.avgBuyPrice);
        }catch(err){
            res.json(err);
        }

        

        // let transactions = await Transaction.find({asset:assetId, transactionType:"buy"})
        // let asset = await Asset.findById(assetId)

    
        // Avg buy price
        // for (let i=0; i<transactions.length; i++){
        //     denominator =+ transactions[i].amount * transactions[i].price;
        //     numerator =+ transactions[i].amount;
        // }
        // avgBuyPrice = denominator / numerator;

        // console.log(avgBuyPrice)

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
