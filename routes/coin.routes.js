const router = require("express").Router();
const Coin = require("../models/Coin.model.js");
const axios = require("axios");

router.get("/update", (req, res, next) => {

    async function getCoins() {
        try {
            const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1000&page=1&sparkline=true&price_change_percentage=24h');
            const coin_updates = response.data.map(coin => Coin.updateOne({ id: coin.id }, coin, { upsert: true }));
            await Promise.all(coin_updates);
            const coins = await Coin.find();
            res.json(coins);
        } catch (error) {
            console.error(error);
        }
    }
    getCoins();
   
});

router.get("/:coinId", (req, res, next) => {
    const {coinId} = req.params

    Coin.findOne({id:coinId})
    .then(coin => {
        console.log(coin)
        res.render('assets/asset',{coin})
    })
    .catch(err => console.log(err));
   
});

module.exports = router;
