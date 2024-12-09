const Booking = require("../models/bookingModel");
const Property = require("../models/propertyModel");
const Person = require("../models/personModel");

// Create a booking for a property viewing
exports.createBooking = async (data) => {
  const { propertyId, renterId, startDate, endDate } = data;

  // Check if property is available
  const property = await Property.findById(propertyId);
  if (!property || !property.isAvailable) {
    throw new Error("Property not available for booking");
  }

  // Check if renter exists
  const renter = await Person.findById(renterId);
  if (!renter || renter.role !== "renter") {
    throw new Error("Invalid renter");
  }

  // Calculate total price
  const durationInMonths = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24 * 30));
  const totalPrice = durationInMonths * property.pricePerMonth;

  // Create the booking
  const booking = new Booking({
    property: propertyId,
    renter: renterId,
    startDate,
    endDate,
    totalPrice,
    status: "pending",
  });

  await booking.save();

  // Mark property as unavailable
  property.isAvailable = false;
  await property.save();

  return booking;
};
