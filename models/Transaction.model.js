const { get } = require("express/lib/response");
const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    buyPrice: { type: Number, default: 1 }, //default : get API
    amount: { type: Number, required: true },
    total: Number,
    transactionType: { type: String, enum: ['buy', 'sell', 'transfer in', 'transfer out'] },
    comment: String,
  },
  created: {
    type: Date,
    default: Date.now
  },
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
