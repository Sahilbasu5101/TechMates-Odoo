const Vehicle = require('../../express/models/Vehicle');
const Driver = require('../../express/models/Driver');

const checkAvailability = async (vehicleId, driverId) => {
  try {
    const vehicle = await Vehicle.findById(vehicleId);
    const driver = await Driver.findById(driverId);

    if (!vehicle || !driver) return { valid: false, reason: "Vehicle or driver not found" };

    if (vehicle.status === 'Available' && driver.status === 'Available') {
      return { valid: true, reason: "Both vehicle and driver are Available" };
    } else {
      let issues = [];
      if (vehicle.status !== 'Available') issues.push(`Vehicle is ${vehicle.status}`);
      if (driver.status !== 'Available') issues.push(`Driver is ${driver.status}`);
      return { valid: false, reason: issues.join(", ") };
    }
  } catch (error) {
    return { valid: false, reason: "Error checking availability" };
  }
};

module.exports = { checkAvailability };
