const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      maxlength: 500,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      introduction: {
        type: String,
        required: true,
      },

      story: {
        type: String,
      },

      keyPoints: {
        type: [String],
        default: [],
      },
    },

    language: {
      type: String,
      default: "en",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Module", moduleSchema);
