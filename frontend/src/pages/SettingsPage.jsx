import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const SettingsPage = () => {
  const { settings, updateSettings } = useSettings();
  const [general, setGeneral] = useState(settings);
  const [isSaved, setIsSaved] = useState(false);

  // Sync local state if context changes externally
  useEffect(() => {
    setGeneral(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(general);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const rbacData = [
    { role: 'Fleet Manager', fleet: '✓', drivers: '✓', trips: '-', fuel: '-', analytics: '✓' },
    { role: 'Dispatcher', fleet: 'View', drivers: '-', trips: '✓', fuel: '-', analytics: '-' },
    { role: 'Safety Officer', fleet: '-', drivers: '✓', trips: 'View', fuel: '-', analytics: '-' },
    { role: 'Financial Analyst', fleet: 'View', drivers: '-', trips: '-', fuel: '✓', analytics: '✓' }
  ];

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold text-white mb-8 border-b border-gray-700 pb-4">8. Settings & RBAC</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: General Settings */}
        <div>
          <h2 className="text-sm text-gray-400 font-semibold tracking-widest uppercase mb-6">General</h2>
          
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider font-medium">Depot Name</label>
              <input 
                type="text" 
                value={general.depotName}
                onChange={e => setGeneral({...general, depotName: e.target.value})}
                className="w-full bg-transparent border border-gray-600 rounded-md p-3 text-gray-300 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider font-medium">Currency</label>
              <input 
                type="text" 
                value={general.currency}
                onChange={e => setGeneral({...general, currency: e.target.value})}
                className="w-full bg-transparent border border-gray-600 rounded-md p-3 text-gray-300 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider font-medium">Distance Unit</label>
              <input 
                type="text" 
                value={general.distanceUnit}
                onChange={e => setGeneral({...general, distanceUnit: e.target.value})}
                className="w-full bg-transparent border border-gray-600 rounded-md p-3 text-gray-300 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="pt-2">
              <button 
                onClick={handleSave}
                className="bg-[#5c9ce6] hover:bg-blue-500 text-[#1a1a1a] font-semibold py-2.5 px-6 rounded-md transition-colors text-sm"
              >
                {isSaved ? 'Saved!' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: RBAC */}
        <div>
          <h2 className="text-sm text-gray-400 font-semibold tracking-widest uppercase mb-6">Role-Based Access (RBAC)</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="text-gray-500 uppercase tracking-widest text-[10px] font-semibold border-b border-gray-700">
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 px-4">Fleet</th>
                  <th className="pb-3 px-4">Drivers</th>
                  <th className="pb-3 px-4">Trips</th>
                  <th className="pb-3 px-4">Fuel/Exp.</th>
                  <th className="pb-3 pl-4">Analytics</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {rbacData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 pr-4 font-medium">{row.role}</td>
                    <td className="py-4 px-4 font-light">{row.fleet}</td>
                    <td className="py-4 px-4 font-light">{row.drivers}</td>
                    <td className="py-4 px-4 font-light">{row.trips}</td>
                    <td className="py-4 px-4 font-light">{row.fuel}</td>
                    <td className="py-4 pl-4 font-light">{row.analytics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
