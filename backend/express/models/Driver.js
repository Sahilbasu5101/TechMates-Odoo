const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  category: { type: String, enum: ['LMV', 'HMV', '2W'], default: 'LMV' },
  licenseExpiryDate: { type: Date, required: true },
  contact: { type: String, required: true },
  tripCompletionRate: { type: Number, default: 100 }, // Percentage
  safetyStatus: {
    type: String,
    enum: ['Available', 'Suspended', 'On Trip', 'Off Duty'],
    default: 'Available'
  },
  status: {
    type: String,
    enum: ['Available', 'On Trip', 'Off Duty', 'Suspended'],
    default: 'Available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
