const router = require("express").Router();
const mongoose = require("mongoose");
const Coin = require("../models/Coin.model.js");
const axios = require("axios");

/*async do_thing() {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1000&page=1&sparkline=true&price_change_percentage=24h')
    const coin_updates = response.data.map(coin => Coin.updateOne({ id: coin.id }, coin, { upsert: true })
    await Promise.all(coin_updates)
    const all_coins = await Coin.find()
    res.json(all_coins)
 } */

/* GET home page */
router.get("/update", (req, res, next) => {

    
    axios
    .get()
    .then(response => {
        Promise.all(response.data.map(coin =>{
            Coin.updateOne({id:coin.id},coin,{upsert: true})
        }))
        .then(() => {
            Coin.find()
            .then(coins=>res.json(coins))
            .catch(err=>console.log(err));
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
});

module.exports = router;
