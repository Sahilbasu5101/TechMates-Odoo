import React, { useState } from 'react';

const DriverPortalPage = () => {
  const [status, setStatus] = useState('Available');
  const [complaint, setComplaint] = useState('');

  const handleUpdateStatus = () => {
    // Call POST /api/driver-portal/status
    alert(`Status updated to ${status}`);
  };

  const handleRaiseComplaint = (e) => {
    e.preventDefault();
    // Call POST /api/driver-portal/complaint
    alert('Complaint submitted: ' + complaint);
    setComplaint('');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Driver Portal</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Update Status</h2>
        <div className="flex gap-4 items-center">
          <select 
            className="border p-2 rounded flex-1"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <button onClick={handleUpdateStatus} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Update
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Raise Complaint / Issue</h2>
        <form onSubmit={handleRaiseComplaint} className="flex flex-col gap-4">
          <textarea 
            className="border p-3 rounded h-32 resize-none"
            placeholder="Describe the issue with your trip or vehicle..."
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            required
          />
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700 self-end">
            Submit Issue
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverPortalPage;
