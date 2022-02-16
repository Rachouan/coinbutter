const { Schema, model } = require("mongoose");

const assetSchema = new Schema(
    {
      coin: { type: Schema.Types.ObjectId, ref: 'Coin' },
      quantity: Number,
      
      transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
      note: String,
      // averageBuyPrice: Number,
      // totalProfit: Number, 
      // averageSellPrice: Number,
    },
    {
      timestamps: true,
    }
);

const Asset = model("Asset", assetSchema);

module.exports = Asset;