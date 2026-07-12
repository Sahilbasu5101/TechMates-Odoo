const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');
const { generateSummary } = require('../../langchain-agents/reportSummaryAgent');

router.get('/kpis', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: { $ne: 'Retired' } });
    const trips = await Trip.find({ status: 'Completed' });

    let totalRevenue = 0;
    let totalCost = 0;
    let totalDistance = 0;
    let totalFuel = 0;

    vehicles.forEach(v => {
      totalCost += v.acquisitionCost;
      totalFuel += v.fuelConsumed || 0;
    });

    trips.forEach(t => {
      totalRevenue += t.revenue || 0;
      totalDistance += t.actualDistanceKm || 0;
    });

    const profit = totalRevenue - totalCost;
    const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    const efficiency = totalFuel > 0 ? (totalDistance / totalFuel) : 0;
    
    const onTripCount = vehicles.filter(v => v.status === 'On Trip').length;
    const utilization = vehicles.length > 0 ? (onTripCount / vehicles.length) * 100 : 0;

    res.json({
      revenue: totalRevenue,
      operationalCost: totalCost,
      profit: profit,
      roi: roi,
      fuelEfficiency: efficiency,
      utilization: utilization
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ai-summary', async (req, res) => {
  try {
    const summary = await generateSummary(req.body);
    res.json({ insight: summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
