const mongoose = require('mongoose');
const shortid = require('shortid');

const { Schema } = mongoose;

shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_',
);
const schema = new Schema(
  {
    orgId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    orgName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    ownedBy: {
      type: [String],
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    managers: {
      type: [String],
      required: true,
    },
    staffs: {
      type: [String],
      required: true,
    },
    subscription: {
      key: {
        type: String,
      }
    },
    status: {
      type: String,
      default: "ACTIVE_TRAIL",
      enum: ["ACTIVE_TRAIL", "DELETED", "CANCELED", "ACTIVE_SUBSCRIBED", "ACTIVE_PREMIUM", "ACTIVE_FREE"]
    }
  },
  {
    timestamps: true,
  },
);

schema.index({ orgId: 1 });
schema.index({ managers: 1 });
schema.index({ staffs: 1 });
schema.index({ ownedBy: 1 });
schema.index({ subscription: 1 });

module.exports = mongoose.model('organisation', schema);
