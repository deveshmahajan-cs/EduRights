const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    selectedAnswer: {
      type: Number,
      required: true,
    },

    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },

    levelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
      required: true,
      index: true,
    },

    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
      index: true,
    },

    answers: {
      type: [answerSchema],
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    totalPoints: {
      type: Number,
      required: true,
      min: 0,
    },

    pointsEarned: {
      type: Number,
      required: true,
      min: 0,
    },

    attemptNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    pointsAwarded: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

quizAttemptSchema.index({
  userId: 1,
  quizId: 1,
  completedAt: -1,
});

module.exports = mongoose.model(
  "QuizAttempt",
  quizAttemptSchema
);
