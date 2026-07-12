import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import TripDispatcherPage from './pages/TripDispatcherPage';
import LiveBoardPage from './pages/LiveBoardPage';
import DriverPortalPage from './pages/DriverPortalPage';
import DriversPage from './pages/DriversPage';
import FleetPage from './pages/FleetPage';
import DashboardPage from './pages/DashboardPage';
import LiveTrackingPage from './pages/LiveTrackingPage';

function App() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'Drivers', path: '/drivers' },
    { name: 'Trips', path: '/' },
    { name: 'Maintenance', path: '/maintenance' },
    { name: 'Fuel & Expenses', path: '/fuel' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <Router>
      <div className="flex h-screen bg-[#121212] text-gray-300 font-sans">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-700 flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white tracking-wide">TransitOps</h1>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'border border-orange-500 text-orange-400 bg-gray-800/50'
                      : 'hover:bg-gray-800 hover:text-white text-gray-400'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Topbar */}
          <header className="h-16 border-b border-gray-700 flex items-center justify-between px-8 bg-[#121212]">
            <div className="w-96">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-transparent border border-gray-600 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Raven K.</span>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg border border-blue-400">
                RK
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-[#181818]">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/live-tracking" element={<LiveTrackingPage />} />
              <Route path="/live-tracking/:tripId" element={<LiveTrackingPage />} />
              <Route path="/" element={<TripDispatcherPage />} />
              <Route path="/fleet" element={<FleetPage />} />
              <Route path="/drivers" element={<DriversPage />} />
              <Route path="/live" element={<LiveBoardPage />} />
              <Route path="/driver" element={<DriverPortalPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
