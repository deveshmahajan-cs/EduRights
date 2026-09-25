const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      select: false,
    },

    passwordHash: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      enum: ["child", "admin"],
      default: "child",
    },

    preferredLanguage: {
      type: String,
      default: "en",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: Hash raw password before persisting
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordHash = this.password;
  } else if (this.isModified("passwordHash") && this.passwordHash && !this.password) {
    if (!this.passwordHash.startsWith("$2a$") && !this.passwordHash.startsWith("$2b$")) {
      const salt = await bcrypt.genSalt(10);
      this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    }
    this.password = this.passwordHash;
  }
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  const hash = this.password || this.passwordHash;
  if (!hash) return false;
  return bcrypt.compare(enteredPassword, hash);
};

module.exports = mongoose.model("User", userSchema);
