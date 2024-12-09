const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");

// Browse available properties (with filters)
router.get("/filter", propertyController.filterProperties);

// Route to fetch filtered properties and answer questions using Gemini
// Define POST route to handle the logic for /api/properties
router.post('/', propertyController.getPropertiesAndAnswerQuery);

// View rental agreement for a property
router.get("/:propertyId/rental-agreement", propertyController.getRentalAgreement);

// Get property details by ID
router.get("/:propertyId", propertyController.getPropertyById);

module.exports = router;
