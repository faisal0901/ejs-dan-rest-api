const router = require("express").Router();
const apiController = require("../Controller/apiController");
// const { uploadSingle, uploadMultiple } = require("../middleware/multer");
const auth = require("../middleware/auth");
router.get("/landing-page", apiController.landingPage);

module.exports = router;
