import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaf icon path issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const originIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Hardcoded locations for Hackathon Demo Geocoding
const LOCATIONS = {
  'Gandhinagar Depot': [23.2156, 72.6369],
  'Ahmedabad Hub': [23.0225, 72.5714],
  'Vatva Industrial Area': [22.9557, 72.6186],
  'Sanand Warehouse': [22.9866, 72.3855],
  'Mansa': [23.4294, 72.6631],
  'Kalol Depot': [23.2427, 72.4939]
};

// Hardcoded trip database for contextual routing in demo
const DEMO_TRIPS = {
  'TR001': { source: 'Gandhinagar Depot', dest: 'Ahmedabad Hub', vehicle: 'VAN-05 / ALEX' },
  'TR004': { source: 'Vatva Industrial Area', dest: 'Sanand Warehouse', vehicle: 'TRUCK-04 / SURESH' },
  'TR006': { source: 'Mansa', dest: 'Kalol Depot', vehicle: 'Unassigned' }
};

const LiveTrackingPage = () => {
  const { tripId } = useParams();
  const [vehicles, setVehicles] = useState({});
  const [realRoute, setRealRoute] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('location_update', (data) => {
      setVehicles((prev) => ({
        ...prev,
        [data.tripId]: {
          lat: data.lat,
          lng: data.lng,
          vehicleId: data.vehicleId,
          lastUpdated: new Date()
        }
      }));
    });

    return () => socket.disconnect();
  }, []);

  const activeTrip = tripId ? DEMO_TRIPS[tripId] : null;
  const sourceCoords = activeTrip ? LOCATIONS[activeTrip.source] : null;
  const destCoords = activeTrip ? LOCATIONS[activeTrip.dest] : null;

  useEffect(() => {
    if (sourceCoords && destCoords) {
      const fetchRoute = async () => {
        try {
          const apiKey = import.meta.env.VITE_ORS_API_KEY;
          // ORS uses [lng, lat] format
          const start = `${sourceCoords[1]},${sourceCoords[0]}`;
          const end = `${destCoords[1]},${destCoords[0]}`;
          
          const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start}&end=${end}`;
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            const coords = data.features[0].geometry.coordinates;
            // Convert back to [lat, lng] for Leaflet
            setRealRoute(coords.map(coord => [coord[1], coord[0]]));
          }
        } catch (error) {
          console.error("Failed to fetch real route from ORS", error);
        }
      };
      
      fetchRoute();
    }
  }, [sourceCoords, destCoords]);
  
  // Center map on source, or default to Gandhinagar
  const mapCenter = sourceCoords || [23.2156, 72.6369];
  const fallbackPolyline = sourceCoords && destCoords ? [sourceCoords, destCoords] : [];
  const displayPolyline = realRoute || fallbackPolyline;

  return (
    <div className="flex flex-col h-full gap-4 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            &larr; Back to Trips
          </Link>
          <h2 className="text-xl font-semibold text-white">
            {tripId ? `Tracking Trip: ${tripId}` : 'Fleet Live Tracking'}
          </h2>
        </div>
        <div className="text-sm text-green-400 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Connected to Live Feed
        </div>
      </div>

      {activeTrip && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex gap-8 items-center">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Vehicle / Driver</span>
            <span className="text-gray-200 font-medium">{activeTrip.vehicle}</span>
          </div>
          <div className="h-8 w-[1px] bg-gray-700"></div>
          <div className="flex items-center gap-3">
            <div>
              <span className="text-xs text-green-500 uppercase tracking-wider block mb-1">Source</span>
              <span className="text-gray-200 font-medium">{activeTrip.source}</span>
            </div>
            <span className="text-gray-500">&rarr;</span>
            <div>
              <span className="text-xs text-red-500 uppercase tracking-wider block mb-1">Destination</span>
              <span className="text-gray-200 font-medium">{activeTrip.dest}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 rounded-xl overflow-hidden border border-gray-700 relative z-0">
        <MapContainer 
          center={mapCenter} 
          zoom={11} 
          style={{ height: '100%', width: '100%', background: '#242424' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Draw Route Line if looking at a specific trip */}
          {displayPolyline.length > 0 && (
            <>
              <Polyline positions={displayPolyline} color="#3b82f6" weight={5} opacity={0.8} />
              <Marker position={sourceCoords} icon={originIcon}>
                <Popup>Source: {activeTrip.source}</Popup>
              </Marker>
              <Marker position={destCoords} icon={destIcon}>
                <Popup>Destination: {activeTrip.dest}</Popup>
              </Marker>
            </>
          )}

          {/* Draw Live Vehicles */}
          {Object.entries(vehicles).map(([id, data]) => {
            // If viewing a specific trip, only show that vehicle
            if (tripId && id !== tripId) return null;

            return (
              <Marker key={id} position={[data.lat, data.lng]}>
                <Popup>
                  <div className="font-semibold text-gray-800">Trip: {id}</div>
                  <div className="text-sm text-gray-600">Vehicle: {data.vehicleId}</div>
                  <div className="text-xs text-blue-600 mt-1 font-semibold animate-pulse">Live Position</div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default LiveTrackingPage;
