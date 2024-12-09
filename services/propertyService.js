const mongoose = require("mongoose");
const Property = require("../models/propertyModel");
const Booking = require("../models/bookingModel");

exports.fetchPropertyById = async (propertyId) => {
  try {
    // Log the propertyId being used
    console.log("Fetching property with ID:", propertyId);

    // Ensure the propertyId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      throw new Error("Invalid property ID");
    }

    // Fetch the property by ID and populate the owner field
    const property = await Property.findById(propertyId).populate("owner", "name email");

    // If property not found, throw an error
    if (!property) {
      console.log("Property not found");
      throw new Error("Property not found");
    }

    console.log("Property found:", property);

    // Return the necessary details about the property
    return {
      id: property._id,
      title: property.title,
      description: property.description,
      location: property.location,
      pricePerMonth: property.pricePerMonth,
      pictures: property.pictures,
      isAvailable: property.isAvailable,
      owner: {
        name: property.owner.name,
        email: property.owner.email,
      },
    };
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching property by ID:", error);
    throw new Error("Error fetching property by ID: " + error.message);
  }
};
exports.filterProperties = async (filters) => {
  try {
    const { location, minPrice, maxPrice } = filters;

    // Build the filter object based on provided filters
    const filterCriteria = {
      ...(location && { 
        location: { $regex: new RegExp(location, 'i') } // Case-insensitive partial match
      }),
      ...(minPrice || maxPrice
        ? {
            pricePerMonth: {
              ...(minPrice && { $gte: Number(minPrice) }), // Minimum price filter
              ...(maxPrice && { $lte: Number(maxPrice) }), // Maximum price filter
            },
          }
        : {}), // If neither minPrice nor maxPrice is provided, this part is skipped
    };

    console.log("Filter criteria applied:", filterCriteria); // Check filter criteria

    // Fetch properties based on the criteria
    const properties = await Property.find(filterCriteria);

    // Return the filtered properties
    return properties;
  } catch (error) {
    console.error("Error filtering properties:", error.message);
    throw new Error("Error filtering properties: " + error.message);
  }
};


exports.fetchRentalAgreement = async (propertyId) => {
  try {
    // Ensure the propertyId is valid
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      throw new Error("Invalid property ID");
    }

    // Fetch the booking associated with the property
    const booking = await Booking.findOne({ property: propertyId })
      .populate("property", "title location pricePerMonth")
      .populate("renter", "name email");

    if (!booking) {
      throw new Error("No rental agreement found for this property");
    }

    // Construct the rental agreement details
    const rentalAgreement = {
      property: {
        title: booking.property.title,
        location: booking.property.location,
        pricePerMonth: booking.property.pricePerMonth,
      },
      renter: {
        name: booking.renter.name,
        email: booking.renter.email,
      },
      rentalPeriod: {
        startDate: booking.startDate,
        endDate: booking.endDate,
      },
      totalPrice: booking.totalPrice,
      status: booking.status,
    };

    return rentalAgreement;
  } catch (error) {
    console.error("Error fetching rental agreement:", error.message);
    throw new Error("Error fetching rental agreement: " + error.message);
  }
};
