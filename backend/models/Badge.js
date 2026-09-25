const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
    },

    requirement: {
      type: {
        type: String,

        enum: [
          "QUIZ_COMPLETION",
          "PERFECT_SCORE",
          "LEVEL_REACHED",
          "POINTS_REACHED",
          "MODULE_COMPLETION",
        ],

        required: true,
      },

      value: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Badge", badgeSchema);
