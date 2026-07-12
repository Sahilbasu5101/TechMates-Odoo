import React, { useState } from 'react';

const MaintenancePage = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Demo Data for Hackathon
  const [records, setRecords] = useState([
    { id: 'MNT-101', vehicleId: 'TR001', type: 'Preventive', description: 'Oil Change & Filters', date: '2026-07-15', cost: 0, status: 'Scheduled' },
    { id: 'MNT-102', vehicleId: 'TR004', type: 'Repair', description: 'Brake Pad Replacement', date: '2026-07-10', cost: 4500, status: 'Completed' },
    { id: 'MNT-103', vehicleId: 'VAN-05', type: 'Inspection', description: 'Annual Fitness Test', date: '2026-07-08', cost: 1200, status: 'Completed' },
    { id: 'MNT-104', vehicleId: 'TRUCK-04', type: 'Repair', description: 'Engine Knocking Issue', date: '2026-07-14', cost: 0, status: 'In Progress' },
  ]);

  const [form, setForm] = useState({ vehicleId: '', type: 'Preventive', description: '', date: '' });

  const handleSchedule = (e) => {
    e.preventDefault();
    const newRecord = {
      id: `MNT-${Math.floor(Math.random() * 1000) + 200}`,
      vehicleId: form.vehicleId,
      type: form.type,
      description: form.description,
      date: form.date,
      cost: 0,
      status: 'Scheduled'
    };
    setRecords([newRecord, ...records]);
    setIsModalOpen(false);
    setForm({ vehicleId: '', type: 'Preventive', description: '', date: '' });
  };

  const filteredRecords = activeTab === 'All' 
    ? records 
    : activeTab === 'Pending' 
      ? records.filter(r => r.status !== 'Completed')
      : records.filter(r => r.status === 'Completed');

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'In Progress': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Scheduled': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Preventive': return '🔧';
      case 'Repair': return '⚠️';
      case 'Inspection': return '📋';
      default: return '⚙️';
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl border-l-4 border-l-orange-500">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Vehicles In Shop</h3>
          <p className="text-3xl font-bold text-white">2</p>
          <span className="text-orange-400 text-xs font-semibold mt-2 inline-block">Impacts dispatch capacity</span>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Scheduled Services</h3>
          <p className="text-3xl font-bold text-white">4</p>
          <span className="text-gray-400 text-xs mt-2 inline-block">Due in next 7 days</span>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total MNT Cost (MTD)</h3>
          <p className="text-3xl font-bold text-white">₹5,700</p>
          <span className="text-green-400 text-xs font-semibold mt-2 inline-block">&darr; 12% vs last month</span>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl flex flex-col justify-center">
          <button onClick={() => setIsModalOpen(true)} className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
            <span>🔧</span> Schedule Service
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
          <h2 className="text-lg font-semibold text-white">Maintenance Logs</h2>
          <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
            {['Pending', 'Completed', 'All'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700/50 text-gray-500 text-xs uppercase tracking-widest font-semibold">
                <th className="py-3 px-4">Ticket</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredRecords.map(record => (
                <tr key={record.id} className="border-b border-gray-800 hover:bg-gray-700/20 transition-colors">
                  <td className="py-4 px-4 text-gray-400 font-mono text-xs">{record.id}</td>
                  <td className="py-4 px-4 text-gray-200 font-bold uppercase">{record.vehicleId}</td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-1.5 text-gray-300">
                      {getTypeIcon(record.type)} {record.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{record.description}</td>
                  <td className="py-4 px-4 text-gray-400">{record.date}</td>
                  <td className="py-4 px-4 text-gray-300 font-medium">{record.cost > 0 ? `₹${record.cost.toLocaleString()}` : '-'}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {record.status !== 'Completed' ? (
                      <button className="text-orange-400 hover:text-orange-300 text-xs font-semibold uppercase tracking-wider">
                        Mark Done
                      </button>
                    ) : (
                      <span className="text-gray-600 text-xs uppercase tracking-wider">Closed</span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">No maintenance records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#181818] p-6 rounded-xl border border-gray-700 w-[450px] shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <span className="text-orange-500">🔧</span> Schedule Maintenance
            </h2>
            <form onSubmit={handleSchedule} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Vehicle ID</label>
                  <input type="text" required placeholder="e.g. TR001" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-orange-500 outline-none uppercase" 
                    value={form.vehicleId} onChange={e => setForm({...form, vehicleId: e.target.value.toUpperCase()})} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Date</label>
                  <input type="date" required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-orange-500 outline-none" 
                    value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Service Type</label>
                <select required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-orange-500 outline-none" 
                  value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="Preventive">Preventive (Oil, Filters)</option>
                  <option value="Repair">Repair (Breakdown)</option>
                  <option value="Inspection">Inspection/Fitness</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Issue Description</label>
                <textarea required placeholder="Describe the issue or service needed..." rows="3" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-orange-500 outline-none resize-none" 
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
              </div>
              
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white px-4 py-2 transition-colors">Cancel</button>
                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-orange-500/20">Schedule Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;
