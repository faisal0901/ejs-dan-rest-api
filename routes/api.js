const router = require("express").Router();
const apiController = require("../Controller/apiController");
const { uploadSingle } = require("../middleware/multer");
const auth = require("../middleware/auth");
router.get("/landing-page", apiController.landingPage);
router.get("/detail-page/:id", apiController.detailPage);
router.post("/booking-page", uploadSingle, apiController.bookingPage);

module.exports = router;
