const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  type: { type: String, required: true }, // e.g., Van, Truck, Mini
  capacity: { type: Number, required: true }, // in kg or string, let's keep it Number to allow logic validation
  odometer: { type: Number, default: 0 },
  acquisitionCost: { type: Number, required: true },
  fuelConsumed: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
    default: 'Available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
