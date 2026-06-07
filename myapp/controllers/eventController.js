const EventModel = require("../models/eventModel");

// PUBLIC: get events with search + filter
exports.getPublicEvents = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      const words = search.trim().split(/\s+/);
      filter.$and = words.map(word => ({
        $or: [
          { title: { $regex: word, $options: "i" } },
          { location: { $regex: word, $options: "i" } },
          { description: { $regex: word, $options: "i" } }
        ]
      }));
    }

    const events = await EventModel.find(filter).sort({ date: 1 });
    res.json(events);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};