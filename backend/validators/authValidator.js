const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters long."),
  email: z.string().trim().email("Valid email address is required."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
  role: z.enum(["child", "admin"]).optional(),
  preferredLanguage: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required."),
  password: z.string().min(1, "Password is required."),
});

module.exports = {
  registerSchema,
  loginSchema,
  validateRegister: registerSchema,
  validateLogin: loginSchema,
};
