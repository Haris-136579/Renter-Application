const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'renter', 'propertyOwner'], 
    default: 'renter' 
  },
  phone: { type: String, required: true },
  address: { type: String }, // Optional address field
  preferences: {
    propertyTypes: [String], // E.g., "apartment", "villa"
    locations: [String],    // Preferred locations
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }], // Array of saved properties
}, { timestamps: true });

// Hash the password before saving
personSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);  // Salt rounds for bcrypt
  this.password = await bcrypt.hash(this.password, salt);  // Hash the password
  next();
});

// Add a method to compare passwords
personSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Person', personSchema);
