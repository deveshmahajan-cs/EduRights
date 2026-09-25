/**
 * Schema-based validation middleware supporting Zod schemas
 * with fallback for custom validator functions.
 */
const validate = (schemaOrFn) => {
  return (req, res, next) => {
    if (schemaOrFn && typeof schemaOrFn.safeParse === "function") {
      const result = schemaOrFn.safeParse(req.body);
      if (!result.success) {
        const errorMessages = result.error.errors.map((e) =>
          e.path.length > 0 ? `${e.path.join(".")}: ${e.message}` : e.message
        );
        return res.status(400).json({
          message: "Validation Error",
          error: errorMessages[0],
          errors: errorMessages,
        });
      }
      req.body = result.data;
      return next();
    }

    if (typeof schemaOrFn === "function") {
      const error = schemaOrFn(req.body);
      if (error) {
        return res.status(400).json({
          message: "Validation Error",
          error,
        });
      }
      return next();
    }

    next();
  };
};

module.exports = { validate };
