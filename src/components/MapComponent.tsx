
// src/components/MapComponent.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { ecoPlaces, EcoPlace } from '@/data/ecoPlaces';

// Fix for default marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icons based on type
const typeIcons = {
  hotel: {
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
  },
  attraction: {
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png'
  },
  water: {
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png'
  },
  district: {
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png'
  }
};

export default function MapComponent() {
  useEffect(() => {
    // This ensures the map is properly initialized on the client side
    if (typeof window !== 'undefined') {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: DefaultIcon.options.iconRetinaUrl,
        iconUrl: DefaultIcon.options.iconUrl,
        shadowUrl: DefaultIcon.options.shadowUrl,
      });
    }
  }, []);

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[25.2048, 55.2708]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {ecoPlaces.map((place) => {
          const icon = L.icon({
            ...DefaultIcon.options,
            ...typeIcons[place.type]
          });

          return (
            <Marker
              key={place.id}
              position={place.coordinates}
              icon={icon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">{place.name}</h3>
                  <p className="capitalize">Type: {place.type}</p>
                  <p className="capitalize">Eco Level: 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                      place.ecoLevel === 'high' ? 'bg-green-100 text-green-800' :
                      place.ecoLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {place.ecoLevel} {place.ecoLevel === 'high' ? '🌱' : place.ecoLevel === 'medium' ? '🌍' : '⚠️'}
                    </span>
                  </p>
                  {place.description && (
                    <p className="mt-2 text-sm text-gray-600">{place.description}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}