import React, { useState } from 'react';

const FuelPage = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [isFuelModalOpen, setIsFuelModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  
  // Demo Data for Hackathon
  const [transactions, setTransactions] = useState([
    { id: 'TX-001', date: '2026-07-12', type: 'Fuel', description: 'Refueled 50L (TR001)', amount: 4500, status: 'Completed' },
    { id: 'TX-002', date: '2026-07-11', type: 'Toll', description: 'Highway Toll Tax (TR004)', amount: 350, status: 'Completed' },
    { id: 'TX-003', date: '2026-07-10', type: 'Maintenance', description: 'Tyre Replacement (TR006)', amount: 12000, status: 'Pending Approval' },
    { id: 'TX-004', date: '2026-07-09', type: 'Fuel', description: 'Refueled 40L (TR004)', amount: 3600, status: 'Completed' },
  ]);

  const [fuelForm, setFuelForm] = useState({ date: '', vehicleId: '', tripId: '', litres: '', amount: '' });
  const [expenseForm, setExpenseForm] = useState({ date: '', category: 'Toll', description: '', amount: '' });

  const handleLogFuel = (e) => {
    e.preventDefault();
    const newTx = {
      id: `TX-${Math.floor(Math.random() * 1000)}`,
      date: fuelForm.date,
      type: 'Fuel',
      description: `Refueled ${fuelForm.litres}L (${fuelForm.vehicleId})`,
      amount: parseFloat(fuelForm.amount),
      status: 'Completed'
    };
    setTransactions([newTx, ...transactions]);
    setIsFuelModalOpen(false);
    setFuelForm({ date: '', vehicleId: '', tripId: '', litres: '', amount: '' });
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    const newTx = {
      id: `TX-${Math.floor(Math.random() * 1000)}`,
      date: expenseForm.date,
      type: expenseForm.category,
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount),
      status: 'Pending Approval'
    };
    setTransactions([newTx, ...transactions]);
    setIsExpenseModalOpen(false);
    setExpenseForm({ date: '', category: 'Toll', description: '', amount: '' });
  };

  const filteredTransactions = activeTab === 'All' ? transactions : transactions.filter(t => t.type === activeTab || (activeTab === 'Other' && t.type !== 'Fuel'));

  const getTypeColor = (type) => {
    switch(type) {
      case 'Fuel': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'Toll': return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'Maintenance': return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Total Fuel Cost (MTD)</h3>
          <p className="text-3xl font-bold text-white">₹24,500</p>
          <span className="text-green-400 text-xs font-semibold mt-2 inline-block">&darr; 4.2% vs last month</span>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Other Expenses (MTD)</h3>
          <p className="text-3xl font-bold text-white">₹14,850</p>
          <span className="text-red-400 text-xs font-semibold mt-2 inline-block">&uarr; 1.5% vs last month</span>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm font-medium mb-1">Avg Fleet Mileage</h3>
          <p className="text-3xl font-bold text-white">4.2 <span className="text-lg text-gray-500 font-medium">km/L</span></p>
          <span className="text-green-400 text-xs font-semibold mt-2 inline-block">&uarr; 0.3 km/L improved</span>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl flex flex-col justify-center gap-3">
          <button onClick={() => setIsFuelModalOpen(true)} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors">
            + Log Fuel
          </button>
          <button onClick={() => setIsExpenseModalOpen(true)} className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white rounded-lg font-semibold text-sm transition-colors">
            + Add Expense
          </button>
        </div>
      </div>

      {/* Ledger Section */}
      <div className="flex-1 bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
          <h2 className="text-lg font-semibold text-white">Transaction Ledger</h2>
          <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-700">
            {['All', 'Fuel', 'Other'].map(tab => (
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
                <th className="py-3 px-4">TX ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-700/20 transition-colors group">
                  <td className="py-4 px-4 text-gray-400 font-mono text-xs">{tx.id}</td>
                  <td className="py-4 px-4 text-gray-300">{tx.date}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getTypeColor(tx.type)}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-200 font-medium">{tx.description}</td>
                  <td className="py-4 px-4 text-right text-gray-200 font-bold">₹{tx.amount.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className={`text-xs font-medium flex items-center gap-1.5 ${tx.status === 'Completed' ? 'text-green-400' : 'text-orange-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Completed' ? 'bg-green-400' : 'bg-orange-400'}`}></div>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">No transactions found in this category.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fuel Modal */}
      {isFuelModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#181818] p-6 rounded-xl border border-gray-700 w-[450px] shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <span className="text-blue-500">⛽</span> Log Fuel Entry
            </h2>
            <form onSubmit={handleLogFuel} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Date</label>
                  <input type="date" required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" 
                    value={fuelForm.date} onChange={e => setFuelForm({...fuelForm, date: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Vehicle ID</label>
                  <input type="text" required placeholder="e.g. TR001" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none uppercase" 
                    value={fuelForm.vehicleId} onChange={e => setFuelForm({...fuelForm, vehicleId: e.target.value.toUpperCase()})} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Trip ID (Optional)</label>
                <input type="text" placeholder="Link to specific trip" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none uppercase" 
                  value={fuelForm.tripId} onChange={e => setFuelForm({...fuelForm, tripId: e.target.value.toUpperCase()})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Litres Filled</label>
                  <input type="number" required placeholder="0.0" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" 
                    value={fuelForm.litres} onChange={e => setFuelForm({...fuelForm, litres: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Total Amount (₹)</label>
                  <input type="number" required placeholder="0.00" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none" 
                    value={fuelForm.amount} onChange={e => setFuelForm({...fuelForm, amount: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setIsFuelModalOpen(false)} className="text-gray-400 hover:text-white px-4 py-2 transition-colors">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20">Save Fuel Log</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#181818] p-6 rounded-xl border border-gray-700 w-[450px] shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <span className="text-purple-500">🧾</span> Add Expense
            </h2>
            <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Date</label>
                  <input type="date" required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-purple-500 outline-none" 
                    value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Category</label>
                  <select required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-purple-500 outline-none" 
                    value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}>
                    <option value="Toll">Highway Toll</option>
                    <option value="Maintenance">Maintenance/Repair</option>
                    <option value="Food">Driver Allowance</option>
                    <option value="Challan">Traffic Challan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Description</label>
                <input type="text" required placeholder="What was this expense for?" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-purple-500 outline-none" 
                  value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Total Amount (₹)</label>
                <input type="number" required placeholder="0.00" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2.5 text-white focus:border-purple-500 outline-none" 
                  value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-800">
                <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="text-gray-400 hover:text-white px-4 py-2 transition-colors">Cancel</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-purple-500/20">Add Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelPage;
