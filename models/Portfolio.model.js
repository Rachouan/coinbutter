const { Schema, model } = require("mongoose");

const portfolioSchema = new Schema(
  {
    assets: { type: Array },
    holdings: { type: Array },
    worth: Number,
  },
  {
    timestamps: true,
  }
);

const Portfolio = model("Portfolio", portfolioSchema);

module.exports = Portfolio;
