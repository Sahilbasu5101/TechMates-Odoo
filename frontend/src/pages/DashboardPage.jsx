import React, { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// ---- design tokens shared with the rest of the app ----
const STATUS_COLOR = {
  Available: { dot: 'bg-green-500', text: 'text-green-500', hex: '#22c55e', badge: 'bg-green-500 text-gray-900' },
  'On Trip': { dot: 'bg-blue-500', text: 'text-blue-400', hex: '#3b82f6', badge: 'bg-blue-500 text-white' },
  'In Shop': { dot: 'bg-orange-500', text: 'text-orange-400', hex: '#f97316', badge: 'bg-orange-500 text-gray-900' },
  Retired: { dot: 'bg-red-400', text: 'text-red-400', hex: '#f87171', badge: 'bg-red-400 text-red-900' },
};

const TRIP_STATUS_BADGE = {
  Draft: 'bg-gray-600 text-gray-200',
  Dispatched: 'bg-blue-500 text-white',
  Completed: 'bg-green-500 text-gray-900',
  Cancelled: 'bg-red-400 text-red-900',
};

// ---- tiny inline icon set (no new dependency) ----
const Icon = {
  Truck: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 3h13v13H1z" /><path d="M14 8h4l4 4v4h-8V8z" /><circle cx="6" cy="18.5" r="1.8" /><circle cx="17.5" cy="18.5" r="1.8" /></svg>
  ),
  Check: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></svg>
  ),
  Wrench: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5.62 4.98L2 18.35 5.65 22l7.07-7.08a4 4 0 0 0 4.98-5.62l-2.83 2.83a2 2 0 0 1-2.83-2.83z" /></svg>
  ),
  Route: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M6 17V9a4 4 0 0 1 4-4h4" /></svg>
  ),
  Clock: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
  ),
  Users: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  Gauge: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 6.32 17.75" /><path d="M12 12 8.5 15.5" /><path d="M12 2v4" /><path d="M22 12h-4" /></svg>
  ),
  Refresh: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" /><path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
  ),
};

const KPI_DEFS = [
  { key: 'activeVehicles', label: 'Active Vehicles', icon: Icon.Truck, accent: 'text-white', chip: 'bg-white/10' },
  { key: 'availableVehicles', label: 'Available Vehicles', icon: Icon.Check, accent: 'text-green-400', chip: 'bg-green-500/10' },
  { key: 'vehiclesInMaintenance', label: 'Vehicles In Maintenance', icon: Icon.Wrench, accent: 'text-orange-400', chip: 'bg-orange-500/10' },
  { key: 'activeTrips', label: 'Active Trips', icon: Icon.Route, accent: 'text-blue-400', chip: 'bg-blue-500/10' },
  { key: 'pendingTrips', label: 'Pending Trips', icon: Icon.Clock, accent: 'text-gray-300', chip: 'bg-gray-500/10' },
  { key: 'driversOnDuty', label: 'Drivers On Duty', icon: Icon.Users, accent: 'text-white', chip: 'bg-white/10' },
];

const EMPTY_KPIS = {
  activeVehicles: 0, availableVehicles: 0, vehiclesInMaintenance: 0,
  activeTrips: 0, pendingTrips: 0, driversOnDuty: 0, fleetUtilization: 0,
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Compact circular gauge used for the Fleet Utilization signature card.
function UtilizationRing({ value }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  const ringColor = pct >= 70 ? '#22c55e' : pct >= 40 ? '#f97316' : '#f87171';
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#2a2a2a" strokeWidth="9" />
      <circle
        cx="50" cy="50" r={r} fill="none" stroke={ringColor} strokeWidth="9"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.8s ease' }}
      />
    </svg>
  );
}

function KpiCard({ def, value, loading }) {
  const Ico = def.icon;
  return (
    <div className="group bg-[#181818] border border-gray-700 rounded-xl p-5 flex flex-col gap-4 hover:border-gray-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">{def.label}</span>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${def.chip}`}>
          <Ico className={`w-4 h-4 ${def.accent}`} />
        </span>
      </div>
      {loading ? (
        <div className="h-9 w-16 bg-gray-800 rounded animate-pulse" />
      ) : (
        <span className={`text-3xl font-semibold tabular-nums ${def.accent} origin-left transition-transform duration-200 group-hover:scale-105`}>
          {String(value).padStart(2, '0')}
        </span>
      )}
    </div>
  );
}

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({ vehicleType: 'All', status: 'All' });
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (filters.vehicleType !== 'All') params.set('vehicleType', filters.vehicleType);
      if (filters.status !== 'All') params.set('status', filters.status);
      const res = await fetch(`http://localhost:5000/api/dashboard?${params.toString()}`);
      if (!res.ok) throw new Error('Request failed');
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
      setError('Could not reach the server — showing the last known values.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const kpis = data?.kpis || EMPTY_KPIS;
  const recentTrips = data?.recentTrips || [];
  const vehicleStatusBreakdown = data?.vehicleStatusBreakdown || [
    { status: 'Available', count: 0 }, { status: 'On Trip', count: 0 },
    { status: 'In Shop', count: 0 }, { status: 'Retired', count: 0 },
  ];
  const totalVehicles = vehicleStatusBreakdown.reduce((s, v) => s + v.count, 0);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header + Filters */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-5 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[10px] uppercase tracking-widest text-green-500 font-semibold">Live</span>
          </div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Fleet Overview</h2>
          <p className="text-xs text-gray-500 mt-1 tabular-nums">
            {lastUpdated ? `Synced ${timeAgo(lastUpdated.toISOString())}` : 'Loading latest data…'}
            <span className="text-gray-700 mx-1.5">·</span>
            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-wrap bg-[#181818] border border-gray-700 rounded-xl p-1.5">
          <select
            value={filters.vehicleType}
            onChange={(e) => setFilters(f => ({ ...f, vehicleType: e.target.value }))}
            className="bg-transparent hover:bg-gray-800 rounded-lg px-3 py-1.5 text-sm text-gray-300 outline-none appearance-none cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-orange-500/50"
          >
            <option className="bg-gray-800" value="All">Type: All</option>
            <option className="bg-gray-800" value="Van">Van</option>
            <option className="bg-gray-800" value="Truck">Truck</option>
          </select>
          <div className="w-px h-5 bg-gray-700 mx-0.5" />
          <select
            value={filters.status}
            onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            className="bg-transparent hover:bg-gray-800 rounded-lg px-3 py-1.5 text-sm text-gray-300 outline-none appearance-none cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-orange-500/50"
          >
            <option className="bg-gray-800" value="All">Status: All</option>
            <option className="bg-gray-800" value="Available">Available</option>
            <option className="bg-gray-800" value="On Trip">On Trip</option>
            <option className="bg-gray-800" value="In Shop">In Shop</option>
            <option className="bg-gray-800" value="Retired">Retired</option>
          </select>
          <div className="w-px h-5 bg-gray-700 mx-0.5" />
          <select disabled className="bg-transparent rounded-lg px-3 py-1.5 text-sm outline-none appearance-none w-28 text-gray-600 cursor-not-allowed">
            <option className="bg-gray-800">Region: All</option>
          </select>
          <div className="w-px h-5 bg-gray-700 mx-0.5" />
          <button
            onClick={fetchDashboard}
            title="Refresh"
            className="hover:bg-orange-500/10 hover:text-orange-400 text-gray-400 rounded-lg p-2 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500/50 outline-none"
          >
            <Icon.Refresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="border border-orange-500/40 bg-orange-500/10 text-orange-300 text-xs rounded-md px-4 py-2">
          {error}
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {KPI_DEFS.map((def) => (
          <KpiCard key={def.key} def={def} value={kpis[def.key]} loading={loading} />
        ))}

        {/* Signature card: Fleet Utilization gauge */}
        <div className="col-span-2 relative overflow-hidden bg-gradient-to-br from-[#1c1c1c] to-[#141414] border border-gray-700 rounded-xl p-5 flex items-center gap-5">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />
          {loading ? (
            <div className="w-24 h-24 rounded-full bg-gray-800 animate-pulse shrink-0" />
          ) : (
            <div className="relative shrink-0">
              <UtilizationRing value={kpis.fleetUtilization} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-white tabular-nums">{kpis.fleetUtilization}%</span>
              </div>
            </div>
          )}
          <div className="relative">
            <span className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">Fleet Utilization</span>
            <p className="text-sm text-gray-400 mt-1 leading-relaxed">
              Share of the active fleet currently on a dispatched trip.
            </p>
            <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />≥70%</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" />40–69%</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />&lt;40%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trips + Vehicle Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Recent Trips */}
        <div className="lg:col-span-2 bg-[#181818] border border-gray-700 rounded-xl p-5 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Recent Trips</h3>
            {!loading && recentTrips.length > 0 && (
              <span className="text-[11px] text-gray-600 tabular-nums">{recentTrips.length} shown</span>
            )}
          </div>
          <div className="relative overflow-y-auto -mx-1 px-1">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-700 text-gray-500 text-[11px] uppercase tracking-widest font-semibold sticky top-0 bg-[#181818] z-10">
                  <th className="py-3 font-medium">Trip</th>
                  <th className="py-3 font-medium">Vehicle</th>
                  <th className="py-3 font-medium">Driver</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading && (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="py-4" colSpan={5}><div className="h-4 bg-gray-800 rounded animate-pulse w-full" /></td>
                    </tr>
                  ))
                )}
                {!loading && recentTrips.map((t) => (
                  <tr key={t.id} className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors">
                    <td className="py-4 text-gray-300 font-mono">{t.code}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 shrink-0 rounded-md bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] font-semibold text-gray-400">
                          {(t.vehicle || '--').slice(0, 2).toUpperCase()}
                        </span>
                        <span className="text-gray-400">{t.vehicle}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-400">{t.driver}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold ${TRIP_STATUS_BADGE[t.status] || 'bg-gray-600 text-gray-200'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {t.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-500 text-xs">{timeAgo(t.createdAt)}</td>
                  </tr>
                ))}
                {!loading && recentTrips.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500 text-sm">
                      No trips yet. Dispatch one from Trip Dispatcher to see it here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Status */}
        <div className="bg-[#181818] border border-gray-700 rounded-xl p-5 flex flex-col">
          <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">Vehicle Status</h3>
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gray-800 animate-pulse" />
            </div>
          ) : totalVehicles === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center text-gray-500 text-sm px-4">
              No vehicles registered yet.
            </div>
          ) : (
            <>
              <div className="h-40 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vehicleStatusBreakdown}
                      dataKey="count"
                      nameKey="status"
                      innerRadius="65%"
                      outerRadius="95%"
                      paddingAngle={2}
                      stroke="none"
                    >
                      {vehicleStatusBreakdown.map((entry) => (
                        <Cell key={entry.status} fill={STATUS_COLOR[entry.status]?.hex || '#6b7280'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#181818', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                      itemStyle={{ color: '#e5e7eb' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-white">{totalVehicles}</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500">Total</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-4">
                {vehicleStatusBreakdown.map((v) => (
                  <div key={v.status} className="flex items-center justify-between text-sm rounded-lg px-2 py-1.5 hover:bg-gray-800/50 transition-colors">
                    <span className="flex items-center gap-2 text-gray-400">
                      <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLOR[v.status]?.dot || 'bg-gray-500'}`} />
                      {v.status}
                    </span>
                    <span className="text-gray-200 font-medium tabular-nums">{v.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
