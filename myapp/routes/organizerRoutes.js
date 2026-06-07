const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const EventModel = require("../models/eventModel");

const uploadDir = path.join(process.cwd(), "uploads");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ["image/png", "image/jpeg", "image/jpg"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files allowed"));
        }
    }
});

// GET only this organizer's events
router.get("/events", async (req, res) => {
    try {
        const events = await EventModel.find({
            organizer: req.query.organizerId
        }).sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create new event
router.post("/events", upload.single("image"), async (req, res) => {
    try {
        const newEvent = new EventModel({
            title: req.body.title,
            category: req.body.category,
            location: req.body.location,
            date: req.body.date,
            time: req.body.time,
            price: req.body.price,
            description: req.body.description,
            image: req.file ? `/uploads/${req.file.filename}` : "",
            organizer: req.body.organizerId
        });
        await newEvent.save();
        res.status(201).json({ message: "Event created", event: newEvent });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update event
router.put("/events/:id", upload.single("image"), async (req, res) => {
    try {
        const updatedData = {
            title: req.body.title,
            category: req.body.category,
            location: req.body.location,
            date: req.body.date,
            time: req.body.time,
            price: req.body.price,
            description: req.body.description
        };
        if (req.file) {
            updatedData.image = "/uploads/" + req.file.filename;
        }
        const updatedEvent = await EventModel.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );
        res.json(updatedEvent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE event
router.delete("/events/:id", async (req, res) => {
    try {
        await EventModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;