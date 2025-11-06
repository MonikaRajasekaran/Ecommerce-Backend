const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
);
const schema = new Schema(
  {
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel"],
    },
    ledgerId: {
      type: String,
      required: true,
    },
    orgId: {
      type: String,
      required: true,
    },
    stationId: {
      type: String,
      required: true,
    },
    pumpId: {
      type: String,
      required: true,
    },
    nozzleId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    opening: {
      type: Number,
      required: true,
    },
    closing: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    fuelPrice: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ ledgerId: 1 });
schema.index({ orgId: 1 });
schema.index({ orgId: 1, stationId: 1 });
schema.index({ orgId: 1, stationId: 1, pumpId: 1 });
schema.index({ orgId: 1, stationId: 1, pumpId: 1, nozzleId: 1 });
schema.index({ orgId: 1, stationId: 1, pumpId: 1, nozzleId: 1, date: 1 });

module.exports = mongoose.model("sales", schema);
