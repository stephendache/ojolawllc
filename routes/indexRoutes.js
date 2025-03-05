const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");

// Define Routes
router.get("/", pagesController.homePage);
router.get("/services", pagesController.servicesPage);
router.get("/contact", pagesController.contactPage);
router.get("/about", pagesController.aboutPage);
router.get("/consultation", pagesController.consultationPage);

module.exports = router;
