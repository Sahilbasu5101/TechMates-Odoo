const Vehicle = require('../../express/models/Vehicle');

const checkCapacity = async (vehicleId, cargoWeight) => {
  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return { valid: false, reason: "Vehicle not found" };

    if (cargoWeight <= vehicle.capacity) {
      return { valid: true, reason: `${cargoWeight}kg <= ${vehicle.capacity}kg` };
    } else {
      return { valid: false, reason: `Cargo (${cargoWeight}kg) exceeds capacity (${vehicle.capacity}kg)` };
    }
  } catch (error) {
    return { valid: false, reason: "Error checking capacity" };
  }
};

module.exports = { checkCapacity };
