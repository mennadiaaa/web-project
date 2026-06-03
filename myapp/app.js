const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "../")));

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/admin.html"));
});

const adminRoutes = require("./routes/adminRoutes");
console.log("ADMIN ROUTES TYPE:", typeof adminRoutes);
app.use("/api/admin", adminRoutes);

const registerRoutes = require("./routes/RegisterRoutes");
console.log("REGISTER ROUTES TYPE:", typeof registerRoutes);
app.use("/api/register", registerRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
