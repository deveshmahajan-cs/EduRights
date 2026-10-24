const asyncHandler = require("express-async-handler");
const { Module, Level, Quiz } = require("../models");

// @desc   Get all published modules
// @route  GET /api/modules
// @access Public (or Private)
const getModules = asyncHandler(async (req, res) => {
  const modules = await Module.find({ isPublished: true }).sort({ order: 1 });
  res.json(modules);
});

// @desc   Get single module by ID
// @route  GET /api/modules/:moduleId
// @access Public (or Private)
const getModuleById = asyncHandler(async (req, res) => {
  const module = await Module.findById(req.params.moduleId);
  if (!module) {
    return res.status(404).json({ message: "Module not found" });
  }
  res.json(module);
});

// @desc   Create module (Admin)
// @route  POST /api/modules
// @access Private (Admin)
const createModule = asyncHandler(async (req, res) => {
  const module = await Module.create(req.body);
  res.status(201).json(module);
});

// @desc   Update module (Admin)
// @route  PUT /api/modules/:moduleId
// @access Private (Admin)
const updateModule = asyncHandler(async (req, res) => {
  const module = await Module.findByIdAndUpdate(
    req.params.moduleId,
    req.body,
    { new: true, runValidators: true }
  );
  if (!module) {
    return res.status(404).json({ message: "Module not found" });
  }
  res.json(module);
});

// @desc   Delete module (Admin)
// @route  DELETE /api/modules/:moduleId
// @access Private (Admin)
const deleteModule = asyncHandler(async (req, res) => {
  const module = await Module.findByIdAndDelete(req.params.moduleId);
  if (!module) {
    return res.status(404).json({ message: "Module not found" });
  }
  // Clean up levels in module
  await Level.deleteMany({ moduleId: req.params.moduleId });
  
  // Clean up quizzes in module
  await Quiz.deleteMany({ moduleId: req.params.moduleId });

  res.json({ message: "Module and related levels and quizzes removed" });
});

module.exports = {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
};
