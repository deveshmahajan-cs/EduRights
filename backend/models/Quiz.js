const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      required: true,

      validate: {
        validator: function (options) {
          return options.length >= 2;
        },

        message: "A question must have at least 2 options.",
      },
    },

    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      select: false,

      validate: {
        validator: function (answer) {
          return answer < this.options.length;
        },

        message: "Correct answer must match an option.",
      },
    },

    explanation: {
      type: String,
    },

    points: {
      type: Number,
      default: 10,
      min: 0,
    },
  },
  {
    _id: true,
  }
);

const quizSchema = new mongoose.Schema(
  {
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
      index: true,
    },

    levelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    questions: {
      type: [questionSchema],

      validate: {
        validator: function (questions) {
          return questions.length >= 5 && questions.length <= 9;
        },

        message: "Quiz must contain between 5 and 9 questions.",
      },
    },

    passingScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
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

module.exports = mongoose.model("Quiz", quizSchema);
