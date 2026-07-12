const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  model: { type: String, required: true },
  plateNumber: { type: String, required: true },
  capacity: { type: Number, required: true }, // in kg
  odometer: { type: Number, default: 0 },
  fuelConsumed: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Available', 'On Trip', 'Maintenance'],
    default: 'Available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
