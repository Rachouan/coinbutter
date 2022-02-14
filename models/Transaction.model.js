const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    buyPrice: Number,
    amnount: Number,
    total: Number,
    date: Date, 
    comment: String
  },
  {
    timestamps: true,
  }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
