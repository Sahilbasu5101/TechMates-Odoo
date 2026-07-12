const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Trip = require('../models/Trip');

// GET /api/dashboard
// Returns aggregated KPIs + recent trips + vehicle status breakdown for the
// main Dashboard screen. Built entirely from the existing Vehicle, Driver and
// Trip collections -- no new collections required.
exports.getDashboardStats = async (req, res) => {
  try {
    const { vehicleType, status } = req.query;

    const vehicleFilter = {};
    if (vehicleType && vehicleType !== 'All') vehicleFilter.type = vehicleType;
    if (status && status !== 'All') vehicleFilter.status = status;

    const [vehicles, drivers, trips] = await Promise.all([
      Vehicle.find(vehicleFilter),
      Driver.find(),
      Trip.find().populate('vehicleId').populate('driver').sort({ createdAt: -1 })
    ]);

    const countByStatus = (list, key) =>
      list.reduce((acc, item) => {
        const val = item[key] || 'Unknown';
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {});

    const vehicleStatusCounts = countByStatus(vehicles, 'status');
    const tripStatusCounts = countByStatus(trips, 'status');

    const activeVehicles = vehicles.filter(v => v.status !== 'Retired').length;
    const availableVehicles = vehicleStatusCounts['Available'] || 0;
    const vehiclesInMaintenance = vehicleStatusCounts['In Shop'] || 0;
    const onTripVehicles = vehicleStatusCounts['On Trip'] || 0;

    const activeTrips = tripStatusCounts['Dispatched'] || 0;
    const pendingTrips = tripStatusCounts['Draft'] || 0;

    const driversOnDuty = drivers.filter(d => d.status === 'On Trip').length;

    const fleetUtilization = activeVehicles > 0
      ? Math.round((onTripVehicles / activeVehicles) * 100)
      : 0;

    const recentTrips = trips.slice(0, 6).map(t => ({
      id: t._id,
      code: `TR${String(t._id).slice(-4).toUpperCase()}`,
      vehicle: t.vehicleId ? (t.vehicleId.model || t.vehicleId.plateNumber) : '—',
      driver: t.driver ? t.driver.name : '—',
      status: t.status,
      source: t.source,
      destination: t.destination,
      createdAt: t.createdAt
    }));

    const vehicleStatusBreakdown = ['Available', 'On Trip', 'In Shop', 'Retired'].map(s => ({
      status: s,
      count: vehicleStatusCounts[s] || 0
    }));

    res.status(200).json({
      kpis: {
        activeVehicles,
        availableVehicles,
        vehiclesInMaintenance,
        activeTrips,
        pendingTrips,
        driversOnDuty,
        fleetUtilization
      },
      recentTrips,
      vehicleStatusBreakdown,
      totals: {
        vehicles: vehicles.length,
        drivers: drivers.length,
        trips: trips.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
