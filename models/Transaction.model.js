const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    
  },
  {
    timestamps: true,
  }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
