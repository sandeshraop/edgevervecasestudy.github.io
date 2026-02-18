const errorHandler = (err, req, res, next) => {
  
  console.error("ERROR:", err);

  let statusCode = 500;
  let message = "Internal Server Error";

  /* =========================
     Sequelize Errors
  ========================= */

  // Validation errors
  if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(", ");
  }

  // Unique constraint errors
  else if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Foreign key constraint errors
  else if (err.name === "SequelizeForeignKeyConstraintError") {
    statusCode = 400;
    message = "Invalid reference data";
  }

  /* =========================
     JWT Errors
  ========================= */

  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  /* =========================
     Custom Errors
  ========================= */

  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;
