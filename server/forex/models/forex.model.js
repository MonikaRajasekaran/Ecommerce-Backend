const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;

const Forex = new Schema(
  {
    currency: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const forexSchema = new Schema({
  forexId: {
    type: String,
    required: true,
    default: shortid.generate,
  },
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  currencies: {
    type: [Forex],
    required: true,
  },
  baseCurrency: {
    type: String,
    default: "USD",
  },
});

forexSchema.index({ date: 1 });

module.exports = mongoose.model("Forex", forexSchema);
