const Vehicle = require('../models/Vehicle');

exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addVehicle = async (req, res) => {
  try {
    const { plateNumber, model, type, capacity, odometer, acquisitionCost } = req.body;
    const newVehicle = new Vehicle({
      plateNumber,
      model,
      type,
      capacity,
      odometer: odometer || 0,
      acquisitionCost,
      status: 'Available'
    });
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
