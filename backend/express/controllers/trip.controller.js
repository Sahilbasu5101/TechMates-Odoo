const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const { runDispatchValidation } = require('../../langchain-agents/dispatchAgent');
const { predictMaintenance } = require('../../langchain-agents/maintenancePredictAgent');

exports.createTrip = async (req, res) => {
  try {
    const { source, destination, vehicleId, driver, cargoWeightKg, actualDistanceKm } = req.body;
    const newTrip = new Trip({
      source, destination, vehicleId, driver, cargoWeightKg, actualDistanceKm, status: 'Draft'
    });
    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.dispatchTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    
    // AI Agent validation
    const validation = await runDispatchValidation({
      vehicleId: trip.vehicleId,
      driverId: trip.driver,
      cargoWeightKg: trip.cargoWeightKg
    });

    if (!validation.isApproved) {
      trip.aiReasoning = validation.reasoningString;
      await trip.save();
      return res.status(400).json({ error: 'Dispatch rejected by AI', reasoning: validation.reasoningString });
    }

    // Approved: Update statuses
    trip.status = 'Dispatched';
    trip.aiReasoning = validation.reasoningString;
    await trip.save();

    await Vehicle.findByIdAndUpdate(trip.vehicleId, { status: 'On Trip' });
    await Driver.findByIdAndUpdate(trip.driver, { status: 'On Trip' });

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.completeTrip = async (req, res) => {
  try {
    const { odometer, fuelConsumed } = req.body;
    const trip = await Trip.findById(req.params.id).populate('vehicleId');
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    trip.status = 'Completed';
    await trip.save();

    const vehicle = await Vehicle.findById(trip.vehicleId._id);
    vehicle.odometer = odometer || vehicle.odometer + (trip.actualDistanceKm || 0);
    vehicle.fuelConsumed = (vehicle.fuelConsumed || 0) + (fuelConsumed || 0);
    vehicle.status = 'Available';
    await vehicle.save();

    await Driver.findByIdAndUpdate(trip.driver, { status: 'Available' });

    // Call prediction agent
    const prediction = await predictMaintenance({
      odometer: vehicle.odometer,
      fuelConsumed: vehicle.fuelConsumed,
      totalTrips: 10 // mock frequency
    });

    res.status(200).json({ trip, maintenancePrediction: prediction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    trip.status = 'Cancelled';
    await trip.save();

    await Vehicle.findByIdAndUpdate(trip.vehicleId, { status: 'Available' });
    await Driver.findByIdAndUpdate(trip.driver, { status: 'Available' });

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLiveTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate('vehicleId').populate('driver');
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.emergencyReassign = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    // Mark current vehicle as Maintenance
    await Vehicle.findByIdAndUpdate(trip.vehicleId, { status: 'Maintenance' });

    // Find a new available vehicle with enough capacity
    const newVehicle = await Vehicle.findOne({
      status: 'Available',
      capacity: { $gte: trip.cargoWeightKg }
    });

    if (!newVehicle) {
      return res.status(404).json({ error: 'No replacement vehicle available' });
    }

    // Reassign
    trip.vehicleId = newVehicle._id;
    await trip.save();

    newVehicle.status = 'On Trip';
    await newVehicle.save();

    res.status(200).json({ message: 'Reassigned successfully', trip });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
