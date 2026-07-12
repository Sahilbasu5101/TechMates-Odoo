import React, { useState, useEffect } from 'react';
import AIReasoningCard from '../components/AIReasoningCard';

const TripDispatcherPage = () => {
  const [formData, setFormData] = useState({
    source: '', destination: '', vehicleId: '', driverId: '', cargoWeightKg: '', actualDistanceKm: ''
  });
  
  const [liveTrips, setLiveTrips] = useState([
    { id: 'TR001', route: 'Gandhinagar Depot -> Ahmedabad Hub', status: 'Dispatched', vehicle: 'VAN-05 / ALEX', eta: '45 min' },
    { id: 'TR004', route: 'Vatva Industrial Area -> Sanand Warehouse', status: 'Draft', vehicle: 'TRUCK-04 / SURESH', eta: 'Awaiting driver' },
    { id: 'TR006', route: 'Mansa -> Kalol Depot', status: 'Cancelled', vehicle: 'Unassigned', eta: 'Vehicle went to shop' },
  ]);

  const [aiError, setAiError] = useState(null);

  const handleDispatch = (e) => {
    e.preventDefault();
    // Simulate AI Validation failure based on mockup
    if (parseInt(formData.cargoWeightKg) > 500) {
      setAiError({
        capacity: 500,
        weight: formData.cargoWeightKg,
        difference: formData.cargoWeightKg - 500
      });
    } else {
      setAiError(null);
      alert('Trip Dispatched successfully!');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full">
      {/* Left Column: Create Trip */}
      <div className="flex flex-col gap-6">
        {/* Trip Lifecycle */}
        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">Trip Lifecycle</h3>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex flex-col items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-green-500">Draft</span>
            </div>
            <div className="h-[2px] w-12 bg-gray-600 -mt-5"></div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
              <span className="text-blue-400">Dispatched</span>
            </div>
            <div className="h-[2px] w-12 bg-gray-600 -mt-5"></div>
            <div className="flex flex-col items-center gap-1 opacity-50">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Completed</span>
            </div>
            <div className="h-[2px] w-12 bg-gray-600 -mt-5"></div>
            <div className="flex flex-col items-center gap-1 opacity-50">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Cancelled</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">Create Trip</h3>
          <form className="flex flex-col gap-4" onSubmit={handleDispatch}>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">SOURCE</label>
              <input className="bg-transparent border border-gray-600 rounded-md p-2 text-sm focus:border-orange-500 outline-none" value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} placeholder="e.g. Gandhinagar Depot" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">DESTINATION</label>
              <input className="bg-transparent border border-gray-600 rounded-md p-2 text-sm focus:border-orange-500 outline-none" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} placeholder="e.g. Ahmedabad Hub" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">VEHICLE (AVAILABLE ONLY)</label>
              <select className="bg-transparent border border-gray-600 rounded-md p-2 text-sm focus:border-orange-500 outline-none appearance-none" onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}>
                <option value="" className="bg-gray-800 text-gray-400">Select Vehicle...</option>
                <option value="VAN-05" className="bg-gray-800">VAN-05 - 500 kg capacity</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">DRIVER (AVAILABLE ONLY)</label>
              <select className="bg-transparent border border-gray-600 rounded-md p-2 text-sm focus:border-orange-500 outline-none appearance-none" onChange={(e) => setFormData({...formData, driverId: e.target.value})}>
                <option value="" className="bg-gray-800 text-gray-400">Select Driver...</option>
                <option value="Alex" className="bg-gray-800">Alex</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">CARGO WEIGHT (KG)</label>
              <input type="number" className="bg-transparent border border-gray-600 rounded-md p-2 text-sm focus:border-orange-500 outline-none" value={formData.cargoWeightKg} onChange={(e) => setFormData({...formData, cargoWeightKg: e.target.value})} placeholder="700" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">PLANNED DISTANCE (KM)</label>
              <input type="number" className="bg-transparent border border-gray-600 rounded-md p-2 text-sm focus:border-orange-500 outline-none" value={formData.actualDistanceKm} onChange={(e) => setFormData({...formData, actualDistanceKm: e.target.value})} placeholder="38" />
            </div>

            {aiError && (
              <div className="border border-red-500/50 bg-red-500/10 rounded-md p-3 text-sm text-red-400 mt-2">
                <p>Vehicle Capacity: {aiError.capacity} kg</p>
                <p>Cargo Weight: {aiError.weight} kg</p>
                <p className="mt-1 flex items-center gap-1 font-semibold">
                  <span>❌</span> Capacity exceeded by {aiError.difference} kg — dispatch blocked
                </p>
              </div>
            )}

            <div className="flex gap-4 mt-2">
              <button type="submit" className="flex-1 bg-gray-700/50 text-gray-400 py-2 rounded-md font-medium cursor-not-allowed border border-gray-600">
                Dispatch (disabled)
              </button>
              <button type="button" className="flex-1 bg-red-900/40 text-red-400 py-2 rounded-md font-medium hover:bg-red-900/60 transition-colors border border-red-900">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Live Board */}
      <div className="flex flex-col">
        <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">Live Board</h3>
        <div className="flex flex-col gap-4">
          {liveTrips.map((trip) => (
            <div key={trip.id} className="border border-dashed border-gray-600 rounded-lg p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start text-sm text-gray-400">
                <span>{trip.id}</span>
                <span>{trip.vehicle}</span>
              </div>
              <div className="text-gray-200 font-medium">
                {trip.route}
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className={`px-3 py-1 rounded-md text-xs font-semibold ${
                  trip.status === 'Dispatched' ? 'bg-blue-500 text-white' : 
                  trip.status === 'Draft' ? 'bg-gray-600 text-gray-200' : 
                  'bg-red-400 text-red-900'
                }`}>
                  {trip.status}
                </span>
                <span className="text-xs text-gray-500">{trip.eta}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-6 mt-auto italic">
          On Complete: odometer → fuel log → expenses → Vehicle & Driver Available
        </p>
      </div>
    </div>
  );
};

export default TripDispatcherPage;
