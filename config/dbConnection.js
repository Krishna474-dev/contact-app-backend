const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.CONNECTION_STRING);

    console.log(
      `✅ MongoDB Connected: ${connection.connection.host} | DB: ${connection.connection.name}`
    );
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

module.exports = connectDb;
