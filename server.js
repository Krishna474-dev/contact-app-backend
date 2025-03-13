const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
// const errorHandler = require("./middleware/errorHandler");
const errorHandlerFun = require("./middleware/errorMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection with Error Handling
(async () => {
  try {
    await connectDb();
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1); // Exit process with failure
  }
})();

// Middleware
app.use(express.json());

// Routes
app.use("/api/contacts", require("./routes/ContactRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// Error Handling Middleware
app.use(errorHandlerFun);

// Start Server with Error Handling
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
