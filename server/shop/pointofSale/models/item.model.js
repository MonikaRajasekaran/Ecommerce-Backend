const mongoose = require("mongoose");
const shortid = require("shortid");
const Float = require("../../../helpers/float").loadType(mongoose, 2);

const { Schema } = mongoose;
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
);
const schema = new Schema(
  {
    itemEntryId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    saleId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ itemEntryId: 1 });
schema.index({ saleId: 1 });
schema.index({ productId: 1 });
schema.index({ saleId: 1, productId: 1 }, { unique: true });
schema.index({ orgId: 1, stationId: 1 });

schema.virtual('products', {
  ref: 'product',
  localField: 'productId',
  foreignField: 'productId'
});

module.exports = mongoose.model("item", schema);
