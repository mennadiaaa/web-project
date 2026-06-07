const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");
const isAuthenticated = require("./middleware/isAuthenticated");
const isAdmin = require("./middleware/isAdmin");
const session = require("express-session");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET || "eventogo-secret",
    resave: false,
    saveUninitialized: false
}));

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

app.use(express.static(path.join(__dirname, "../")));

app.get("/admin", isAuthenticated, isAdmin, (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "../pages/admin.html"
        )
    );
});

app.use(
    "/api/admin",
    require("./routes/adminRoutes")
);

app.use(
    "/api/register",
    require("./routes/RegisterRoutes")
);

app.use(
    "/api/auth",
    require("./routes/authRoutes")
);

app.use(
    "/api/events",
    require("./routes/eventRoutes")
);

app.use(
    "/api/bookings",
    require("./routes/bookingRoutes")
);

app.use("/api/organizer", require("./routes/organizerRoutes"));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running ${PORT}`);
});