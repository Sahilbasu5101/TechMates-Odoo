const Driver = require('../../express/models/Driver');

const checkLicense = async (driverId) => {
  try {
    const driver = await Driver.findById(driverId);
    if (!driver) return { valid: false, reason: "Driver not found" };

    const today = new Date();
    if (driver.licenseExpiryDate >= today) {
      return { valid: true, reason: `Driver license valid till ${driver.licenseExpiryDate.toISOString().split('T')[0]}` };
    } else {
      return { valid: false, reason: `Driver license expired on ${driver.licenseExpiryDate.toISOString().split('T')[0]}` };
    }
  } catch (error) {
    return { valid: false, reason: "Error checking license" };
  }
};

module.exports = { checkLicense };
