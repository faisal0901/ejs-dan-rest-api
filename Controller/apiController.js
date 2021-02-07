const Item = require("../Model/Item");
const Treasure = require("../Model/Activity");
const Traveler = require("../Model/Booking");
module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select("_id title country city price unit imageId")
        .limit(5)
        .populate({ path: "imageId", select: "_id imageUrl" });
      const traveler = await Traveler.find();
      const treasure = await Treasure.find();
      const city = await Item.find();
      res.status(200).json({
        hero: {
          traveler: traveler.length,
          treasure: treasure.length,
          city: city.length,
        },
        mostPicked,
      });
    } catch (error) {}
  },
};
