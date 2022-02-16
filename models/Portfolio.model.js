const { Schema, model } = require("mongoose");

const portfolioSchema = new Schema(
  { 
    name: String,
    assets: [{ type: Schema.Types.ObjectId, ref: 'Asset' }],
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    currency: { type: String, required:true },
    apiKey: String,
    apiSecret: String,
    apiName: String
  },
  {
    timestamps: true,
  }
);

const Portfolio = model("Portfolio", portfolioSchema);

module.exports = Portfolio;