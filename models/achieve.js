const mongoose = require("mongoose");

const AchieveSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      max: 500,
    },
    conversation: {
      type: String,
      max: 500,
    },
    message: {
      type: String,
      max: 500,
    },
    insta: { type: String },
    imgss: { type: String },
    youtube: { type: String },
    other: { type: String },
    country: { type: String },
    state: { type: String },
    village: { type: String },
    sub_village: { type: String },
    category: { type: String },
    district: { type: String },
    mandal: { type: String },
    town: { type: String },
    sub_category: { type: String },
    rating: { type: Number, default: 0 },
    img: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achieve", AchieveSchema);
