require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const seedAdmin = require("./seedAdmin");
const seedBadges = require("./seedBadges");
const seedModules = require("./seedModules");

const runSeed = async () => {
  try {
    await connectDB();
    console.log("Starting EduRights database seeding...");

    await seedAdmin();
    await seedBadges();
    await seedModules();

    console.log("EduRights database seeding completed successfully! ✨");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

runSeed();
