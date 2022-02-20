const { Schema, model } = require("mongoose");

const portfolioSchema = new Schema(
  { 
    id: { type:String, unique: true,required: true},
    name: String,
    amount: Number,
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