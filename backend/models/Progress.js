const mongoose = require("mongoose");

const levelProgressSchema = new mongoose.Schema(
  {
    levelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
      required: true,
    },

    levelNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    points: {
      type: Number,
      default: 0,
      min: 0,
    },

    bestQuizScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,

      enum: [
        "LOCKED",
        "NOT_STARTED",
        "IN_PROGRESS",
        "COMPLETED",
      ],

      default: "LOCKED",
    },

    completedAt: {
      type: Date,
    },

    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    _id: false,
  }
);

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },

    currentLevel: {
      type: Number,
      default: 1,
      min: 1,
    },

    totalPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    moduleScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,

      enum: [
        "NOT_STARTED",
        "IN_PROGRESS",
        "COMPLETED",
      ],

      default: "NOT_STARTED",
    },

    levels: {
      type: [levelProgressSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

progressSchema.index(
  {
    userId: 1,
    moduleId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Progress", progressSchema);
