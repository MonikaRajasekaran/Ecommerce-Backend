const mongoose = require("mongoose");

const { Schema } = mongoose;
const shortid = require("shortid");

const menuItemSchema = new Schema(
  {
    menuItemId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Map,
      of: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
    date: {
      type: Number,
    },
    popular: {
      type: Boolean,
      default: false,
    },
    prepTime: {
      type: String,
    },
    cookTime: {
      type: String,
    },
    selectedSize: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      default: "AVAILABLE",
      enum: ["AVAILABLE", "UNAVAILABLE"],
    },
    gst: {
      type: Number,
      default: 0,
    },
    orgId:{
      type: String,
    },
    createdBy: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("menuItem", menuItemSchema);
