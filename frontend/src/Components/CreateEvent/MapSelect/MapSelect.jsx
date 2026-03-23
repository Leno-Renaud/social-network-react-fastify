import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Composant qui gère le clic sur la carte
function LocationMarker({ lat, lng, onSelect }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      // On remonte l'info au parent, c'est lui qui gère la vérité maintenant
      onSelect({ lat, lng });
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  // Effet pour centrer la carte si les props changent (ex: via une recherche ou un bouton)
  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.flyTo([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);

  // Si pas de coordonnées, on n'affiche rien
  if (lat === null || lng === null) return null;

  return (
    <Marker position={[lat, lng]}>
      <Popup>
        Lieu de l'événement <br /> 
        Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
      </Popup>
    </Marker>
  );
}

function LocateUser() {
  const map = useMap();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      map.setView([latitude, longitude], 13);
    });
  }, [map]);

  return null;
}

export default function MapSelect({ lat, lng, onLocationSelect }) {
  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: "200px", width: "100%" }}>
      <TileLayer
        url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=gwzGSwSPdmnp9pR2RMiKU4NoHFJKWHJXTLBFquoMGzwWOlJfPF8Dc59MQSNrfto0"
        attribution='&copy; <a href="https://jawg.io">Jawg Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        minZoom={0}
        maxZoom={22}
      />
      <LocateUser />
      <LocationMarker lat={lat} lng={lng} onSelect={onLocationSelect}/>
    </MapContainer>
  );
}