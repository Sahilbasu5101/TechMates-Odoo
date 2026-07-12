const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  source: { type: String, required: true },
  destination: { type: String, required: true },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  cargoWeightKg: { type: Number, required: true },
  actualDistanceKm: { type: Number },
  status: {
    type: String,
    enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
    default: 'Draft'
  },
  aiReasoning: { type: String }, // To store AI approval/rejection details
  revenue: { type: Number, default: 0 },
  fuelConsumed: { type: Number, default: 0 },
  completedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
