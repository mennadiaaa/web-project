const EventModel = require("../models/EventModel");

// PUBLIC: get events with search + filter
exports.getPublicEvents = async (req, res) => {
  try {

    const { category, search } = req.query;

    const filter = {};

    // filter by category
    if (category) {
      filter.category = category;
    }

    // search by title or location
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
};