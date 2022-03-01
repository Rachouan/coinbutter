const router = require("express").Router();

const mongoose = require("mongoose");

const Portfolio = require("../models/Portfolio.model.js");
const Asset = require("../models/Asset.model.js");
const User = require("../models/User.model.js");
const Coin = require("../models/Coin.model.js");


const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const helper = require("../helpers/helpers.js");

// Routes

router.get("/create", (req, res) => {
  res.render("portfolio/create");
});

router.post('/create', (req, res) => {
  
  const user = req.session.user.id;
  const { name, currency } = req.body;

  if(!name || !currency){
    return res.render('portfolio/create',{errors:{message:'Please enter a name and select a currency'},portfolio:{_id:portfolioId,name,currency}})
  }
  if(name.length < 2){
    return res.render('portfolio/create',{errors:{message:'Choose a name thats longer than 2 characters'},portfolio:{_id:portfolioId,name,currency}})
  }

  Portfolio.create({ id:helper.concatString(name),name,value:0,assets:[],user,currency })
  .then(portfolio => {
    console.log(portfolio);
    res.redirect(`/portfolio/${portfolio._id}`);
  })
  .catch(err => console.log(err));
  
});

router.get('/:portfolioId', (req, res, next) => {
  const {portfolioId} = req.params;
  
  Portfolio.findOne({_id:portfolioId})
    .populate({
      path : 'assets',
      populate : {
        path : 'coin transactions',
      }
    })
    .then(portfolio => {
      let amount = 0;
      let total = 0;
      let num = 0;

      let portfolioTotal = portfolio.assets.reduce((a,b) => {
        amount = b.amount * b.coin.current_price;
        b.totalAmount =  helper.amountFormatter(amount);
        
        b.transactions.forEach(transaction => {
          if(transaction.transactionType === 'buy'){
            total += transaction.amount * transaction.price;
            num += transaction.amount;
          }
        });

        b.avgBuyPrice = total / num;

        total = 0;
        num = 0;

        return a + amount;
      } ,0);
      
      portfolio.total = helper.amountFormatter(portfolioTotal);

      //Total Value in BTC
      Coin.findOne({id:"bitcoin"}).then((btc) => {
        portfolio.total_b = (portfolioTotal / btc.current_price).toFixed(8)
      })

      res.render('portfolio/portfolio',{portfolio})
    })
    .catch(err => console.log(err));
});

router.get("/:portfolioId/edit", (req, res) => {
  const {portfolioId} = req.params;
  Portfolio.findOne({_id:portfolioId})
    .then(portfolio => {
        res.render('portfolio/edit',{portfolio})
    })
    .catch(err => console.log(err));
});

router.post("/:portfolioId/edit", (req, res) => {
  const {portfolioId} = req.params;
  const {name, currency } = req.body;

  if(!name || !currency){
    return res.render('portfolio/edit',{errors:{message:'Please enter a name and select a currency'},portfolio:{_id:portfolioId,name,currency}})
  }
  if(name.length < 2){
    return res.render('portfolio/edit',{errors:{message:'Choose a name thats longer than 2 characters'},portfolio:{_id:portfolioId,name,currency}})
  }

  Portfolio.findOneAndUpdate({_id:portfolioId},{name, currency })
    .then(portfolio => {
        res.redirect(`/portfolio/${portfolio._id}`);
    })
    .catch(err => console.log(err));
});

router.post("/:portfolioId/delete", (req, res) => {
  const user = req.session.user.id;
  const {portfolioId} = req.params;

  console.log(user);

  async function checkIfUserPortfolio(){
    try {
      const portfolio = await Portfolio.findOne({_id:portfolioId});
      console.log(portfolio.user);
      if(portfolio.user == user){
        await Portfolio.deleteOne({ _id: portfolioId });
        res.redirect(`/dashboard/`);
      }else{
        res.redirect(`/portfolio/${portfolio}`);
      }
    }catch(err){
      console.log(err)
    }
  }

  checkIfUserPortfolio();

});


router.get('/portfolio/:portfolioId/asset/:coinId', (req, res) => {
  res.render('assets/asset');
}); 

// Module export

module.exports = router;