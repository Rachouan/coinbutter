const { Schema, model } = require("mongoose");

const portfolioSchema = new Schema(
  {
    assets: [],
    holdings: [],
    worth: Number,
  },
  {
    timestamps: true,
  }
);

const Portfolio = model("Portfolio", portfolioSchema);

module.exports = Portfolio;
