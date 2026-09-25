const jwt = require("jsonwebtoken");
const { User } = require("../models");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_edurights_secret_key"
      );

      req.user = await User.findById(decoded.id).select("-password -passwordHash");
      if (!req.user) {
        return res.status(401).json({ message: "User not found with this token" });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid or expired token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
