import React, { useState, useEffect } from 'react';

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', licenseNumber: '', category: 'LMV', licenseExpiryDate: '', contact: ''
  });

  const fetchDrivers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/drivers');
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error('Failed to fetch drivers', error);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', licenseNumber: '', category: 'LMV', licenseExpiryDate: '', contact: '' });
        fetchDrivers(); // Refresh list
      }
    } catch (error) {
      console.error('Error adding driver', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-500 text-gray-900';
      case 'Suspended': return 'bg-orange-500 text-gray-900';
      case 'On Trip': return 'bg-blue-500 text-white';
      case 'Off Duty': return 'bg-gray-500 text-white';
      default: return 'bg-gray-600 text-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 relative">
      {/* Top Action Bar */}
      <div className="flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center gap-2"
        >
          <span>+</span> Add Driver
        </button>
      </div>

      {/* Drivers Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-gray-700 text-gray-500 text-xs uppercase tracking-widest font-semibold">
              <th className="py-4 font-medium">DRIVER</th>
              <th className="py-4 font-medium">LICENSE NO.</th>
              <th className="py-4 font-medium">CATEGOR</th>
              <th className="py-4 font-medium">EXPIRY</th>
              <th className="py-4 font-medium">CONTACT</th>
              <th className="py-4 font-medium">TRIP COMPL.</th>
              <th className="py-4 font-medium">SAFETY</th>
              <th className="py-4 font-medium">STATUS</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {drivers.map((driver) => (
              <tr key={driver._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                <td className="py-4 text-gray-300">{driver.name}</td>
                <td className="py-4 text-gray-400">{driver.licenseNumber}</td>
                <td className="py-4 text-gray-400">{driver.category}</td>
                <td className="py-4 text-gray-400">
                  {new Date(driver.licenseExpiryDate).toLocaleDateString('en-GB', { month: '2-digit', year: 'numeric' })}
                </td>
                <td className="py-4 text-gray-400">{driver.contact}</td>
                <td className="py-4 text-gray-400">{driver.tripCompletionRate}%</td>
                <td className="py-4">
                  <span className={`px-4 py-1.5 rounded-md text-xs font-semibold ${getStatusColor(driver.safetyStatus)}`}>
                    {driver.safetyStatus}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`px-4 py-1.5 rounded-md text-xs font-semibold ${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </span>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-500">No drivers found. Add a driver to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Toggle Stats & Rules */}
      <div className="mt-auto">
        <h4 className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">TOGGLE STAT</h4>
        <div className="flex gap-4 mb-4">
          <button className="bg-green-500 text-gray-900 font-semibold px-6 py-2 rounded-md text-sm">Available</button>
          <button className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md text-sm">On Trip</button>
          <button className="bg-gray-500 text-white font-semibold px-6 py-2 rounded-md text-sm">Off Duty</button>
          <button className="bg-orange-500 text-gray-900 font-semibold px-6 py-2 rounded-md text-sm">Suspended</button>
        </div>
        <p className="text-orange-500 text-xs italic font-medium">
          Rule: Expired license or Suspended status &rarr; blocked from trip assignment
        </p>
      </div>

      {/* Add Driver Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#181818] p-6 rounded-lg border border-gray-700 w-96 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-white">Add New Driver</h2>
            <form onSubmit={handleAddDriver} className="flex flex-col gap-4">
              <input 
                type="text" required placeholder="Driver Name" 
                className="bg-transparent border border-gray-600 rounded p-2 text-white focus:border-orange-500 outline-none"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="text" required placeholder="License No (e.g. DL-12345)" 
                className="bg-transparent border border-gray-600 rounded p-2 text-white focus:border-orange-500 outline-none"
                value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
              />
              <select 
                className="bg-transparent border border-gray-600 rounded p-2 text-white focus:border-orange-500 outline-none"
                value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="LMV" className="bg-gray-800">LMV</option>
                <option value="HMV" className="bg-gray-800">HMV</option>
              </select>
              <input 
                type="date" required 
                className="bg-transparent border border-gray-600 rounded p-2 text-white focus:border-orange-500 outline-none"
                value={formData.licenseExpiryDate} onChange={(e) => setFormData({...formData, licenseExpiryDate: e.target.value})}
              />
              <input 
                type="text" required placeholder="Contact Number" 
                className="bg-transparent border border-gray-600 rounded p-2 text-white focus:border-orange-500 outline-none"
                value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white px-4 py-2">Cancel</button>
                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded">Save Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversPage;
