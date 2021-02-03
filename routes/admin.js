const router = require("express").Router();
const AdminController = require("../Controller/AdminController");
const { uploadSingle, uploadMultiple } = require("../middleware/multer");
router.get("/dashboard", AdminController.viewDashboard);
//category
router.get("/Category", AdminController.viewCategory);
router.post("/Category", AdminController.addCategory);
router.put("/Category", AdminController.editCategory);
router.delete("/Category/:id", AdminController.deleteCategory);
//bank
router.get("/Bank", AdminController.viewBank);
router.post("/Bank", uploadSingle, AdminController.addBank);
router.put("/Bank", uploadSingle, AdminController.editBank);
router.delete("/Bank/:id", AdminController.deleteBank);
//item
router.get("/Item", AdminController.viewItem);
router.post("/Item", uploadMultiple, AdminController.addItem);
router.get("/Item/show-image/:id", AdminController.showImageItem);
router.get("/Item/:id", AdminController.showEditItem);
router.put("/Item/:id", uploadMultiple, AdminController.editItem);
router.delete("/Item/:id", AdminController.deleteItem);
//detail item
router.get("/Item/show-detail-item/:itemId", AdminController.viewDetailItem);
router.post(
  "/Item/view-detail-item/add/feature/",
  uploadSingle,
  AdminController.addFeature
);
router.put(
  "/Item/view-detail-item/edit/feature/",
  uploadSingle,
  AdminController.editFeature
);
router.delete("/item/:itemId/feature/:id", AdminController.deleteFeature);
router.post(
  "/Item/view-detail-item/add/activity/",
  uploadSingle,
  AdminController.addActivity
);
router.put(
  "/Item/view-detail-item/edit/activity/",
  uploadSingle,
  AdminController.editActivity
);
router.delete("/item/:itemId/activity/:id", AdminController.deleteActivity);
router.get("/booking", AdminController.viewBooking);

module.exports = router;
