const { Schema, model } = require("mongoose");

const marketStatSchema = new Schema(
  { 
    name: String,
    symbol: String,
    icon: {type: String, default: },
    _id: { type: string, required: true },
    currency: { type: Schema.Types.ObjectId, ref: 'Portfolio' },
    price_change_percentage: { type: String, enum: ["1h", "24h", "7d", "14d", "30d", "200d", "1y"] },
    sparkline: {type: Boolean, default: false}
  },
  {
    timestamps: true
  }
);

const Market = model("Market", marketStatSchema);

module.exports = Market;