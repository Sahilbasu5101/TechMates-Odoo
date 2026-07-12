import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../context/SettingsContext';

const AnalyticsPage = () => {
  const { getCurrencySymbol } = useSettings();
  const currency = getCurrencySymbol();
  const [kpis, setKpis] = useState({ revenue: 0, operationalCost: 0, profit: 0, roi: 0, fuelEfficiency: 0, utilization: 0 });
  const [aiInsight, setAiInsight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data directly from our actual unified backend
    fetch('http://localhost:5000/api/analytics/kpis')
      .then(res => res.json())
      .then(data => {
        setKpis(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load KPIs", err);
        setLoading(false);
      });
  }, []);

  const handleGenerateAI = async () => {
    setAiInsight('Generating AI Insight...');
    try {
      const res = await fetch('http://localhost:5000/api/analytics/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kpis)
      });
      const data = await res.json();
      setAiInsight(data.insight);
    } catch (err) {
      setAiInsight('Error generating insight. Please check backend connection.');
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Financial & Operational Analytics</h1>
        <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading analytics data...</div>
      ) : (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
              <h3 className="text-gray-400 text-sm font-medium mb-1">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-400">{currency}{kpis.revenue.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
              <h3 className="text-gray-400 text-sm font-medium mb-1">Operational Cost</h3>
              <p className="text-3xl font-bold text-red-400">{currency}{kpis.operationalCost.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
              <h3 className="text-gray-400 text-sm font-medium mb-1">Net Profit</h3>
              <p className="text-3xl font-bold text-white">{currency}{kpis.profit.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
              <h3 className="text-gray-400 text-sm font-medium mb-1">ROI</h3>
              <p className="text-3xl font-bold text-blue-400">{kpis.roi.toFixed(2)}%</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
              <h3 className="text-gray-400 text-sm font-medium mb-1">Fleet Utilization</h3>
              <p className="text-3xl font-bold text-orange-400">{kpis.utilization.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-xl">
              <h3 className="text-gray-400 text-sm font-medium mb-1">Fuel Efficiency</h3>
              <p className="text-3xl font-bold text-white">{kpis.fuelEfficiency.toFixed(2)} km/L</p>
            </div>
          </div>

          {/* AI Insight Section */}
          <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">✨</div>
            <h2 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <span>✨</span> AI Business Insight (Powered by Groq)
            </h2>
            
            {aiInsight ? (
              <p className="text-gray-300 leading-relaxed text-lg italic mt-4 border-l-4 border-blue-500 pl-4">{aiInsight}</p>
            ) : (
              <button 
                onClick={handleGenerateAI}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg shadow-blue-500/20 transition-all"
              >
                Generate Executive Summary
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
