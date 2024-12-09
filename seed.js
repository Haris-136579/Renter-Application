const mongoose = require('mongoose');
const Person = require('./models/personModel');
const Property = require('./models/propertyModel');
const Booking = require('./models/bookingModel');

mongoose.connect('mongodb://localhost:27017/property_rental_system')
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.log('Database connection error: ', err));


async function seedData() {
  // Create sample persons (users)
  const person1 = new Person({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',  // In real apps, you should hash the password
    role: 'renter',
    phone: '1234567890',
    address: '123 Main St',
    preferences: {
      propertyTypes: ['apartment'],
      locations: ['New York'],
    },
  });

  const person2 = new Person({
    name: 'Alice Smith',
    email: 'alice@example.com',
    password: 'password123',  // In real apps, you should hash the password
    role: 'propertyOwner',
    phone: '0987654321',
    address: '456 Elm St',
  });

  await person1.save();
  await person2.save();

  console.log('Persons created');

  // Create sample properties
  const property1 = new Property({
    title: 'Luxury Apartment in New York',
    description: 'A luxurious 2-bedroom apartment with great amenities.',
    location: 'New York',
    pricePerMonth: 2500,
    pictures: ['https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=600'],
    owner: person2._id,
    isAvailable: true,
  });

  const property2 = new Property({
    title: 'Cozy Studio in San Francisco',
    description: 'A small but cozy studio apartment in the heart of SF.',
    location: 'San Francisco',
    pricePerMonth: 1500,
    pictures: ['https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=600'],
    owner: person2._id,
    isAvailable: true,
  });

  await property1.save();
  await property2.save();

  console.log('Properties created');

  // Create sample bookings
  const booking1 = new Booking({
    property: property1._id,
    renter: person1._id,
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-10'),
    totalPrice: property1.pricePerMonth * 0.3, // Assuming booking is for 10 days
    status: 'confirmed',
  });

  const booking2 = new Booking({
    property: property2._id,
    renter: person1._id,
    startDate: new Date('2024-12-05'),
    endDate: new Date('2024-12-15'),
    totalPrice: property2.pricePerMonth * 0.5, // Assuming booking is for 10 days
    status: 'pending',
  });

  await booking1.save();
  await booking2.save();

  console.log('Bookings created');

  // Close the connection
  mongoose.connection.close();
}

// Run the seeding function
seedData().catch((err) => console.log('Error seeding data: ', err));
