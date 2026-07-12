const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  issueDescription: { type: String, required: true },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
