const Driver = require('../models/Driver');
const Complaint = require('../models/Complaint');

exports.updateStatus = async (req, res) => {
  try {
    const { driverId, status } = req.body;
    const driver = await Driver.findByIdAndUpdate(driverId, { status }, { new: true });
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.raiseComplaint = async (req, res) => {
  try {
    const { driverId, tripId, issueDescription } = req.body;
    const complaint = new Complaint({
      driver: driverId,
      trip: tripId,
      issueDescription
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
