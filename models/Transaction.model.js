const { get } = require("express/lib/response");
const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    price: { type: Number, required:true }, //default : get API
    currency: { type: String, required:true },
    amount: { type: Number, required: true },
    total: Number,
    transactionType: { type: String, enum: ['buy', 'sell', 'transfer in', 'transfer out'] },
    note: String,
    created: { type: Date, default: Date.now },
  },
  {
    timestamps: true
  }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
