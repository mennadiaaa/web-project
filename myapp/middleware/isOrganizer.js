const User = require("../models/User");

module.exports = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user || user.role !== "organizer") {
            return res.status(403).json({ message: "Access denied. Organizers only." });
        }
        next();
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};