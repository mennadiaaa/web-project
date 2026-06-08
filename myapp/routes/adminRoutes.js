const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");

const {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
} = require("../controllers/adminController");

const validateEvent = require("../middleware/validateEvent");

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "eventogo",
        allowed_formats: ["jpg", "jpeg", "png"]
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = [
            "image/png",
            "image/jpeg",
            "image/jpg"
        ];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files allowed"));
        }
    }
});

// EVENT ROUTES
router.get("/events", getEvents);

router.post(
    "/events",
    upload.single("image"),
    validateEvent,
    createEvent
);

router.put(
    "/events/:id",
    (req, res, next) => {
        upload.single("image")(req, res, function (err) {
            if (err) {
                console.log("MULTER ERROR:");
                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            next();
        });
    },
    validateEvent,
    updateEvent
);

router.delete("/events/:id", deleteEvent);

// USER MANAGEMENT ROUTES
const User = require("../models/user");

router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.json(users);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        res.json({
            message: "User deleted"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = router;