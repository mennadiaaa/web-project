const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
    console.log("DATABASE NAME:", mongoose.connection.name);

  } catch (error) {
    console.log("MONGO ERROR:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;