const mongoose = require("mongoose");

const { Schema } = mongoose;
const shortid = require("shortid");

const receiptSchema = new Schema(
  {
    rxId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    appointmentId: {
      type: String,
      required: true,
    },
    patientId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      required: true,
    },
    drugs: {
      type: [Drug],
      required: true,
    },
    fees: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      },
    },
    videoCallURL: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "PENDING",
      enum: [
        "PENDING",
        "ACCEPTED",
        "RESCHEDULE",
        "REQUIRED_FOLLOW_UP",
        "REJECT",
        "COMPLETED",
      ],
    },
    reason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Receipt", receiptSchema);
