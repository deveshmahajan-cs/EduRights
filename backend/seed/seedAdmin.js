const { User } = require("../models");

const seedAdmin = async () => {
  const adminEmail = "admin@edurights.org";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await User.create({
      name: "EduRights Administrator",
      email: adminEmail,
      password: "Admin@12345",
      role: "admin",
      preferredLanguage: "en",
    });
    console.log("✓ Created default admin: admin@edurights.org / Admin@12345");
  } else {
    console.log("✓ Default admin already exists.");
  }
};

module.exports = seedAdmin;
