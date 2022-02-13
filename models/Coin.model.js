const { Schema, model } = require("mongoose");

const coinSchema = new Schema(
    {
        coin: String,
        name: String,
        price: Number,
        holdings: Number,
        //averageBuyPrice: Number,
        //averageSellPrice: Number,
    },
    {
      timestamps: true,
    }
);

const Coin = model("Coin", coinSchema);

module.exports = Coin;