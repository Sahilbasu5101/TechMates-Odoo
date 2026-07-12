const Driver = require('../models/Driver');

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addDriver = async (req, res) => {
  try {
    const { name, licenseNumber, category, licenseExpiryDate, contact } = req.body;
    const newDriver = new Driver({
      name,
      licenseNumber,
      category,
      licenseExpiryDate,
      contact,
      tripCompletionRate: 100, // Default 100%
      safetyStatus: 'Available',
      status: 'Available'
    });
    await newDriver.save();
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
