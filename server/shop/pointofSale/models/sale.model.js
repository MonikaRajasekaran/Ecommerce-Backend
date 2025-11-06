const mongoose = require("mongoose");
const shortid = require("shortid");
const Float = require("../../../helpers/float").loadType(mongoose, 2);

const { Schema } = mongoose;
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
);

const Product = new Schema({
  name: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  amount: {
    type: Float,
    required: true,
  },
  pdtDesc: {
    type: String,
  },
  meta: {
    type: Schema.Types.Mixed,
  }
})

const schema = new Schema(
  {
    saleId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    orgId: {
      type: String,
      required: true,
    },
    stationId: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    products: {
      type: [Product],
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
      enum: ["CASH", "CARD", "WALLET"]
    },
    cash: {
      type: Number,
      default: 0
    },
    cashReturend: {
      type: Number,
      default: 0
    },
    isPaid: {
      type: String,
      default: "paid",
    },
    status: {
      type: String,
      default: "COMPLETED",
      enum: ["COMPLETED", "CANCELED", "LENDING"],
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ productId: 1 });
schema.index({ saleId: 1 });
schema.index({ orgId: 1, stationId: 1 });


schema.virtual('station', {
  ref: 'fuelStation',
  localField: 'stationId',
  foreignField: 'stationId'
});

schema.virtual('organisation', {
  ref: 'organisation',
  localField: 'orgId',
  foreignField: 'orgId'
});

module.exports = mongoose.model("sale", schema);
