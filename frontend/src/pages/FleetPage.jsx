import React, { useState, useEffect } from 'react';

const FleetPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: '', model: '', type: 'Van', capacity: '', odometer: '', acquisitionCost: ''
  });

  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vehicles');
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Failed to fetch vehicles', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ plateNumber: '', model: '', type: 'Van', capacity: '', odometer: '', acquisitionCost: '' });
        fetchVehicles(); // Refresh list
      }
    } catch (error) {
      console.error('Error adding vehicle', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-500 text-gray-900';
      case 'On Trip': return 'bg-blue-500 text-white';
      case 'In Shop': return 'bg-orange-500 text-gray-900';
      case 'Retired': return 'bg-red-400 text-red-900';
      default: return 'bg-gray-600 text-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 relative">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <select className="bg-transparent border border-gray-600 rounded-md p-2 text-sm focus:border-orange-500 outline-none appearance-none w-40 text-gray-300">
            <option className="bg-gray-800">Type: All</option>
          </select>
          <select className="bg-transparent border border-gray-600 rounded-md p-2 text-sm focus:border-orange-500 outline-none appearance-none w-40 text-gray-300">
            <option className="bg-gray-800">Status: All</option>
          </select>
          <input 
            type="text" 
            placeholder="Search reg. no..." 
            className="bg-transparent border border-gray-600 rounded-md p-2 text-sm focus:border-orange-500 outline-none w-64"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center gap-2"
        >
          <span>+</span> Add Vehicle
        </button>
      </div>

      {/* Vehicles Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-gray-700 text-gray-500 text-xs uppercase tracking-widest font-semibold">
              <th className="py-4 font-medium">REG. NO. (UNIQUE)</th>
              <th className="py-4 font-medium">NAME/MODE</th>
              <th className="py-4 font-medium">TYPE</th>
              <th className="py-4 font-medium">CAPACITY</th>
              <th className="py-4 font-medium">ODOMETE</th>
              <th className="py-4 font-medium">ACQ. COST</th>
              <th className="py-4 font-medium">STATUS</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {vehicles.map((vehicle) => (
              <tr key={vehicle._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                <td className="py-4 text-gray-300 font-mono">{vehicle.plateNumber}</td>
                <td className="py-4 text-gray-400 uppercase">{vehicle.model}</td>
                <td className="py-4 text-gray-400 capitalize">{vehicle.type}</td>
                <td className="py-4 text-gray-400">{vehicle.capacity >= 1000 ? `${vehicle.capacity/1000} Ton` : `${vehicle.capacity} kg`}</td>
                <td className="py-4 text-gray-400">{vehicle.odometer.toLocaleString()}</td>
                <td className="py-4 text-gray-400">{vehicle.acquisitionCost.toLocaleString()}</td>
                <td className="py-4">
                  <span className={`px-4 py-1.5 rounded-md text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">No vehicles found. Add a vehicle to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Rule Text */}
      <div className="mt-auto">
        <p className="text-orange-500 text-xs italic font-medium">
          Rule: Registration No. must be unique • Retired/In Shop vehicles are hidden from Trip Dispatcher
        </p>
      </div>

      {/* Add Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#181818] p-6 rounded-lg border border-gray-700 w-96 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-white">Add New Vehicle</h2>
            <form onSubmit={handleAddVehicle} className="flex flex-col gap-4">
              <input 
                type="text" required placeholder="Registration No. (e.g. GJ01AB4521)" 
                className="bg-transparent border border-gray-600 rounded p-2 text-white focus:border-orange-500 outline-none uppercase"
                value={formData.plateNumber} onChange={(e) => setFormData({...formData, plateNumber: e.target.value.toUpperCase()})}
              />
              <input 
                type="text" required placeholder="Name/Model (e.g. VAN-05)" 
                className="bg-transparent border border-gray-600 rounded p-2 text-white focus:border-orange-500 outline-none uppercase"
                value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value.toUpperCase()})}
              />
              <select 
                className="bg-transparent border border-gray-600 rounded p-2 text-white focus:border-orange-500 outline-none"
                value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Van" className="bg-gray-800">Van</option>
                <option value="Truck" className="bg-gray-800">Truck</option>
                <option value="Mini" className="bg-gray-800">Mini</option>
              </select>
              <input 
                type="number" required placeholder="Capacity (in kg, e.g. 500)" 
                className="bg-transparent border border-gray-600 rounded p-2 text-white focus:border-orange-500 outline-none"
                value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})}
              />
              <input 
                type="number" required placeholder="Current Odometer" 
                className="bg-transparent border border-gray-600 rounded p-2 text-white focus:border-orange-500 outline-none"
                value={formData.odometer} onChange={(e) => setFormData({...formData, odometer: e.target.value})}
              />
              <input 
                type="number" required placeholder="Acquisition Cost" 
                className="bg-transparent border border-gray-600 rounded p-2 text-white focus:border-orange-500 outline-none"
                value={formData.acquisitionCost} onChange={(e) => setFormData({...formData, acquisitionCost: e.target.value})}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white px-4 py-2">Cancel</button>
                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded">Save Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetPage;
