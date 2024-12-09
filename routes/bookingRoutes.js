const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

// Book a property
router.post("/book", bookingController.bookProperty);

module.exports = router;
