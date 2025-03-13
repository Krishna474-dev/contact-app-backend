const errorHandlerFun = (err, req, res, next) => {
  const statusCode = res.statusCode < 400 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: err.stack || null,
  });
};

module.exports = errorHandlerFun;
