import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('transitOpsSettings');
    if (saved) return JSON.parse(saved);
    return {
      depotName: 'Gandhinagar Depot GJ4',
      currency: 'INR (₹)',
      distanceUnit: 'Kilometers'
    };
  });

  useEffect(() => {
    localStorage.setItem('transitOpsSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
  };

  // Helper to extract just the symbol if needed (e.g. "INR (₹)" -> "₹")
  const getCurrencySymbol = () => {
    const match = settings.currency.match(/\(([^)]+)\)/);
    return match ? match[1] : settings.currency;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, getCurrencySymbol }}>
      {children}
    </SettingsContext.Provider>
  );
};
