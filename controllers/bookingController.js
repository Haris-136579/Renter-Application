const bookingService = require("../services/bookingService");

exports.bookProperty = async (req, res) => {
  try {
    const { propertyId, renterId, startDate, endDate } = req.body;

    // Call the service to create the booking
    const booking = await bookingService.createBooking({ propertyId, renterId, startDate, endDate });

    // Respond with the booking details
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Error in bookProperty controller:", error.message);
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};
