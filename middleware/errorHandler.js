const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  // Get the status code from the error, or default to 500
  const statusCode = err.statusCode || 500;

  // Define error response structure
  const errorResponse = {
    title: "",
    message: err.message || "An error occurred",
    ...(process.env.NODE_ENV === "development" && { stackTrace: err.stack }), // Show stack trace only in development
  };

  // Handle different types of errors
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      errorResponse.title = "Validation Failed";
      break;

    case constants.UNAUTHORIZED:
      errorResponse.title = "Unauthorized";
      break;

    case constants.FORBIDDEN:
      errorResponse.title = "Forbidden";
      break;

    case constants.NOT_FOUND:
      errorResponse.title = "Not Found";
      break;

    case constants.SERVER_ERROR:
      errorResponse.title = "Internal Server Error";
      break;

    default:
      errorResponse.title = "Error";
      break;
  }

  // Send error response with correct status code
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;
