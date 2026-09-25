const { Badge } = require("../models");

const badgesData = [
  {
    name: "First Steps",
    description: "Completed your first quiz on child rights!",
    icon: "🌟",
    requirement: {
      type: "QUIZ_COMPLETION",
      value: 1,
    },
    isActive: true,
  },
  {
    name: "Rights Champion",
    description: "Completed 3 quizzes successfully.",
    icon: "🏆",
    requirement: {
      type: "QUIZ_COMPLETION",
      value: 3,
    },
    isActive: true,
  },
  {
    name: "Perfect Scholar",
    description: "Scored 100% on a level quiz!",
    icon: "💯",
    requirement: {
      type: "PERFECT_SCORE",
      value: 100,
    },
    isActive: true,
  },
  {
    name: "Point Pioneer",
    description: "Earned 100 total points across all learning modules.",
    icon: "⚡",
    requirement: {
      type: "POINTS_REACHED",
      value: 100,
    },
    isActive: true,
  },
  {
    name: "Module Master",
    description: "Successfully finished all levels in an educational module!",
    icon: "🎓",
    requirement: {
      type: "MODULE_COMPLETION",
      value: 1,
    },
    isActive: true,
  },
];

const seedBadges = async () => {
  const operations = badgesData.map((b) => ({
    updateOne: {
      filter: { name: b.name },
      update: { $set: b },
      upsert: true,
    },
  }));
  await Badge.bulkWrite(operations);
  console.log(`✓ Seeded ${badgesData.length} Badges.`);
};

module.exports = seedBadges;
