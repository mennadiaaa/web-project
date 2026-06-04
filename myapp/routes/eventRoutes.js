const express = require("express");
const router = express.Router();

const EventModel = require("../models/EventModel");

router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    // category filter
    if (category) {
      filter.category = category;
    }

    // search filter (title + location)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }

    const events = await EventModel.find(filter).sort({ date: 1 });

    res.json(events);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;