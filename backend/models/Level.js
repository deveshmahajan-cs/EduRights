const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
      index: true,
    },

    levelNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    unlockRequirement: {
      previousLevelRequired: {
        type: Boolean,
        default: true,
      },

      minimumScore: {
        type: Number,
        default: 50,
        min: 0,
        max: 100,
      },
    },

    order: {
      type: Number,
      required: true,
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

levelSchema.index(
  {
    moduleId: 1,
    levelNumber: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Level", levelSchema);
