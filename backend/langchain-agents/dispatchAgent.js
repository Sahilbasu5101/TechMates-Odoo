const { checkCapacity } = require('./tools/checkCapacity');
const { checkLicense } = require('./tools/checkLicense');
const { checkAvailability } = require('./tools/checkAvailability');

// In a full LangChain setup, this would be an Agent Executor calling the tools.
// For this MERN stack, we orchestrate the tools directly and use Gemini to format or 
// return a reasoning string if needed. Here we generate the reasoning string programmatically 
// based on tool outputs, which mimics the required AI output.
const runDispatchValidation = async (tripRequest) => {
  const { vehicleId, driverId, cargoWeightKg } = tripRequest;
  
  const capacityResult = await checkCapacity(vehicleId, cargoWeightKg);
  const licenseResult = await checkLicense(driverId);
  const availabilityResult = await checkAvailability(vehicleId, driverId);
  
  const isApproved = capacityResult.valid && licenseResult.valid && availabilityResult.valid;
  
  let reasoning = [];
  reasoning.push(`Capacity Check: ${capacityResult.reason}`);
  reasoning.push(`License Check: ${licenseResult.reason}`);
  reasoning.push(`Availability Check: ${availabilityResult.reason}`);
  
  const finalStatus = isApproved ? "APPROVED" : "REJECTED";
  const reasoningString = `[check] ${reasoning.join(', ')} -> ${finalStatus}`;

  return {
    isApproved,
    reasoningString
  };
};

module.exports = { runDispatchValidation };
