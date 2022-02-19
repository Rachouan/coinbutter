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
    console.log(req);
    console.log('HELLO')
    res.render('transactions/create');
}); 


router.post('/:portfolioId/transactions/create', (req, res) => {
    const {portfolioId} = req.params;
    const user = req.session.user.id;
    const {price, currency, amount,coin, total, transactionType, note, created} = req.body; 

    //console.log({ coin, portfolioId },{price, currency, amount, total, transactionType, note, created})
    // Check if asset already in user's portfolio and update or create

    async function findIfAlreadyHere() {
        
    //   coin: { type: Schema.Types.ObjectId, ref: 'Coin' },
    //   quantity: Number,
    //   portfolioId: {type: Schema.Types.ObjectId, ref: 'Portfolio'},
    //   transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
    //   note: String,

        let asset = await Asset.findOne({ coin:coin, portfolioId: portfolioId });
        let portfolio = await Portfolio.findOne({ coin:coin, portfolioId: portfolioId });
        if(!asset){
            asset = await Asset.create({coin,amount,portfolioId})
            await Portfolio.findOneAndUpdate({_id:portfolioId},{$push: { assets: asset.id  }});
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

        console.log(portfolio);
        res.redirect(`/portfolio/${portfolio.id}`);
        //res.json(asset);
        
    }
    findIfAlreadyHere();
});




router.post('/', (req, res) => {}); 

// Module export

module.exports = router;