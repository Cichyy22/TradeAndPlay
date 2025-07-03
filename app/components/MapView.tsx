'use client';

import { MapContainer, TileLayer, useMapEvents, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import AddListingForm from '@/app/components/AddListingForm';
import ListingPopupContent from './ListingPopupContent';

const redIcon = new L.Icon({
  iconUrl: 'https://www.svgrepo.com/show/470991/arrow-circle-down.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
const anotherIcon = new L.Icon({
  iconUrl: 'https://uxwing.com/wp-content/themes/uxwing/download/arrow-direction/chevron-down-icon.svg ',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function LocationHandler({ onSelectLocation }: { onSelectLocation: (latlng: L.LatLng) => void }) {
  useMapEvents({
    contextmenu(e) {
      onSelectLocation(e.latlng); // desktop
    },
    click(e) {
      if (window.innerWidth < 768) {
        onSelectLocation(e.latlng); // mobile
      }
    },
  });
  return null;
}

export default function MapView({ distanceKm }: { distanceKm: number }) {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [formPos, setFormPos] = useState<{ lat: number; lng: number } | null>(null);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
        },
        (error) => {
          console.error('Błąd pobierania lokalizacji:', error);
          setUserPosition([52.2297, 21.0122]); 
        }
      );
    }

    // Pobierz istniejące ogłoszenia z backendu
    fetch('/api/listing')
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(err => {
        console.error('Błąd pobierania ogłoszeń:', err);
        setListings([]);
      });
  }, []);

const handleAddListing = (data: {
  id: string;
  title: string;
  description: string;
  contact: string;
  type: 'BOOK' | 'GAME';
  lat?: number;
  lng?: number;
}) => {
  setListings((prev) => [...prev, data]);
  setFormPos(null);
};

  function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

  if (!userPosition) {
    return <div>Ładowanie mapy i lokalizacji...</div>;
  }

  return (
    <MapContainer
      center={userPosition}
      zoom={13}
      className="w-full h-[100dvh]" 
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      <LocationHandler onSelectLocation={(latlng) => setFormPos({ lat: latlng.lat, lng: latlng.lng })} />
      {userPosition && (
        <Circle
          center={userPosition}
          radius={distanceKm * 1000}
          pathOptions={{
            color: 'blue',
            fillColor: 'blue',
            fillOpacity: 0.05,
          }}
        />
      )}
      {/* Markery istniejących ogłoszeń */}
      {listings .filter(
            (listing) =>
              listing.lat &&
              listing.lng &&
              userPosition &&
              getDistanceKm(userPosition[0], userPosition[1], listing.lat, listing.lng) <= distanceKm
          )
          .map((listing) => (
          listing.lat && listing.lng && (
          <Marker
            key={listing.id}
            position={[listing.lat, listing.lng]}
            icon={redIcon}
          >
            <Popup>
            <ListingPopupContent listing={listing} />
            </Popup>
          </Marker>
        )
      ))}

      {/* Marker i popup z formularzem do dodawania ogłoszenia */}
      {formPos && (
        <Marker icon={anotherIcon} position={[formPos.lat, formPos.lng]}>
          <Popup onClose={() => setFormPos(null)}>
            <AddListingForm
              lat={formPos.lat}
              lng={formPos.lng}
              onSubmit={handleAddListing}
            />
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
