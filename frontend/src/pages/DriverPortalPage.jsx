import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const DriverPortalPage = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  const toggleLocationSharing = () => {
    if (isSharing) {
      setIsSharing(false);
      return;
    }

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsSharing(true);
    navigator.geolocation.watchPosition(
      (position) => {
        if (socket) {
          socket.emit('update_location', {
            tripId: 'TR001', // Example trip ID for demo
            vehicleId: 'VAN-05',
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  };
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
        <div className="flex gap-4 mb-6">
          <button 
            onClick={toggleLocationSharing}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              isSharing ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSharing ? 'Stop Sharing Location' : 'Start Trip & Share Location'}
          </button>
          <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors">
            Log Fuel/Expense
          </button>
        </div>

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
