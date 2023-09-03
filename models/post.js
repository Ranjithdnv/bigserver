const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    messages: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
