const propertyService = require("../services/propertyService");
const geminiService = require("../services/geminiService");
const Property = require('../models/propertyModel');

// Get available properties (with filtering)
exports.getAvailableProperties = async (req, res) => {
  try {
    const properties = await propertyService.fetchAvailableProperties(req.query);
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties", error });
  }
};


// Extract rent and location from the query string
function extractRentAndLocation(query) {
  // Match rent amount (e.g., $1500, $1200)
  const rentMatch = query.match(/\$\d+/);
  // Match location (e.g., "in New York")
  const locationMatch = query.match(/in\s([a-zA-Z\s,]+)/);

  console.log("Rent match:", rentMatch);
  console.log("Location match:", locationMatch);

  return {
    rent: rentMatch ? parseInt(rentMatch[0].replace('$', '')) : null,
    location: locationMatch ? locationMatch[1].trim() : null,
  };
}

// Check if the query is related to properties
function isPropertyRelated(query) {
  const propertyKeywords = ['rent', 'location', 'price', 'apartment', 'house', 'property', 'renting', 'lease'];
  return propertyKeywords.some(keyword => query.toLowerCase().includes(keyword));
}
exports.getPropertiesAndAnswerQuery = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: "Query body is required." });

    const isPropertyQuery = isPropertyRelated(query);
    let properties = [];
    let geminiAnswer = "";

    if (isPropertyQuery) {
      const { rent, location } = extractRentAndLocation(query);
      
      if (rent || location) {
        const searchQuery = {};
        if (location) searchQuery.location = new RegExp(location, 'i');
        if (rent) searchQuery.pricePerMonth = { $lte: rent };
        properties = await Property.find(searchQuery);
        
        // If no properties found, create a specific message for Gemini
        if (properties.length === 0) {
          const noResultsQuery = `I searched our database for properties ${location ? `in ${location}` : ''} ${rent ? `under $${rent}` : ''} but couldn't find any matches. Can you suggest some alternative locations or price ranges that might have more options?`;
          geminiAnswer = await geminiService.processQueryWithGemini(noResultsQuery);
        }
      }
    } else {
      geminiAnswer = await geminiService.processQueryWithGemini(query);
    }

    return res.json({
      success: true,
      message: isPropertyQuery ? (properties.length > 0 ? "Properties fetched successfully" : "No matching properties found") : "Query processed successfully",
      data: {
        properties,
        geminiAnswer
      }
    });

  } catch (error) {
    console.error("Error processing query:", error);
    return res.status(500).json({
      success: false,
      message: "Error processing query",
      error: error.message
    });
  }
};




exports.filterProperties = async (req, res) => {
  try {
    // Extract query parameters from the request
    const filters = req.query;

    // Call the service to fetch filtered properties
    const properties = await propertyService.filterProperties(filters);

    // Respond with the filtered properties
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error in filterProperties controller:", error.message);
    res.status(500).json({ message: "Error filtering properties", error: error.message });
  }
};


exports.getRentalAgreement = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Log the request for debugging purposes
    console.log("Fetching rental agreement for property:", propertyId);

    // Fetch the rental agreement details
    const rentalAgreement = await propertyService.fetchRentalAgreement(propertyId);

    // Send the response with rental agreement details
    res.status(200).json(rentalAgreement);
  } catch (error) {
    console.error("Error in getRentalAgreement controller:", error.message);
    res.status(500).json({ message: "Error fetching rental agreement", error: error.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Log the propertyId received in the request
    console.log("Received propertyId:", propertyId);

    // Fetch property details using the service
    const property = await propertyService.fetchPropertyById(propertyId);

    // If property not found, return 404
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Return the fetched property details
    res.status(200).json(property);
  } catch (error) {
    console.error("Error in getPropertyById controller:", error.message);
    // Send a response with the error message and status 500
    res.status(500).json({ message: "Error fetching property", error: error.message });
  }
};
