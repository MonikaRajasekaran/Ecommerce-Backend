const mongoose = require("mongoose");

const { Schema } = mongoose;
const shortid = require("shortid");
const Mixed = Schema.Types.Mixed;

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    customer: {
      type: Mixed,
      required: true
    },
    items: {
      type: [Mixed],  // <-- Fully flexible item structure
      required: true
    },
    paymentDetail: {
      type: Mixed,
      required: true
    },
    order: {
      id: String,
      status: String,
      description: String,
      createdAt: Date
    },
    userType: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    orderDate:{
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['ORDERED','ORDER_PLACED', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED'],
      default: 'ORDERED'
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

module.exports = mongoose.model("Order", orderSchema);
