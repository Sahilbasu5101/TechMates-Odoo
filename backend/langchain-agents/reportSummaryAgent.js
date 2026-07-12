// Mock agent since GROQ_API_KEY is not provided
const generateSummary = async (kpis) => {
  // If we had a real GROQ key, we would use ChatGroq here.
  // For the hackathon demo, we return a smart-sounding mock response based on the data.
  
  const profitStatus = kpis.profit > 0 ? "generating a healthy profit" : "operating at a loss";
  const utilizationStatus = kpis.utilization > 50 ? "high utilization rate" : "sub-optimal utilization";

  return `The fleet is currently ${profitStatus} with an ROI of ${kpis.roi.toFixed(1)}%. We are seeing a ${utilizationStatus} (${kpis.utilization.toFixed(0)}% of vehicles dispatched). To improve profitability, focus on optimizing routes to increase fuel efficiency from the current ${kpis.fuelEfficiency.toFixed(1)} km/L.`;
};

module.exports = { generateSummary };
