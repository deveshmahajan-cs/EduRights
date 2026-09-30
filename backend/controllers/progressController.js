const asyncHandler = require("express-async-handler");
const { Progress } = require("../models");
const progressService = require("../services/progressService");

// @desc   Get all progress records for current user
// @route  GET /api/progress
// @access Private
const getMyProgress = asyncHandler(async (req, res) => {
  const progressList = await Progress.find({ userId: req.user._id })
    .populate("moduleId", "title topic order")
    .sort({ updatedAt: -1 });

  res.json(progressList);
});

// @desc   Get user's progress for a specific module
// @route  GET /api/progress/:moduleId
// @access Private
const getModuleProgress = asyncHandler(async (req, res) => {
  let progress = await Progress.findOne({
    userId: req.user._id,
    moduleId: req.params.moduleId,
  }).populate("moduleId", "title topic content");

  if (!progress) {
    // Encapsulated progress initialization via progressService
    progress = await progressService.getOrCreateProgress(
      req.user._id,
      req.params.moduleId
    );
    // Direct document population without redundant findById roundtrip
    await progress.populate("moduleId", "title topic content");
  }

  res.json(progress);
});

module.exports = {
  getMyProgress,
  getModuleProgress,
};
