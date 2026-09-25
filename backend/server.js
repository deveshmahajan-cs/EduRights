require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const levelRoutes = require("./routes/levelRoutes");
const quizRoutes = require("./routes/quizRoutes");
const progressRoutes = require("./routes/progressRoutes");
const badgeRoutes = require("./routes/badgeRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const knowledgeRoutes = require("./routes/knowledgeRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

// Initialize DB connection
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "EduRights API", timestamp: new Date() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/levels", levelRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/feedback", feedbackRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`EduRights API server running on port ${PORT}`);
  });
}

module.exports = app;
