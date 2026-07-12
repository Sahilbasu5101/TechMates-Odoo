import React, { useState, useEffect } from 'react';

const LiveBoardPage = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // In real app, fetch from GET /api/trips/live
    setTrips([
      { id: 'T101', source: 'Mumbai', destination: 'Pune', status: 'Dispatched', vehicle: 'MH12 AB1234', driver: 'Raju' },
      { id: 'T102', source: 'Delhi', destination: 'Agra', status: 'Draft', vehicle: 'DL01 CD5678', driver: 'Sham' },
      { id: 'T103', source: 'Bangalore', destination: 'Mysore', status: 'Completed', vehicle: 'KA02 EF9012', driver: 'Babu' }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-200 text-gray-800';
      case 'Dispatched': return 'bg-blue-200 text-blue-800';
      case 'Completed': return 'bg-green-200 text-green-800';
      case 'Cancelled': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Live Trip Board</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-4">Trip ID</th>
              <th className="p-4">Route</th>
              <th className="p-4">Vehicle</th>
              <th className="p-4">Driver</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {trips.map(trip => (
              <tr key={trip.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-semibold">{trip.id}</td>
                <td className="p-4">{trip.source} → {trip.destination}</td>
                <td className="p-4">{trip.vehicle}</td>
                <td className="p-4">{trip.driver}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
                    {trip.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveBoardPage;
