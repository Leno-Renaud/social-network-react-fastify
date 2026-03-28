import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

function LocationMarker({ lat, lng }) {
  const map = useMap();

  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.flyTo([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);

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

export default function MapView({ lat, lng, onLocationSelect }) {
  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: "200px", width: "100%" }}>
      <TileLayer
        url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=gwzGSwSPdmnp9pR2RMiKU4NoHFJKWHJXTLBFquoMGzwWOlJfPF8Dc59MQSNrfto0"
        attribution='&copy; <a href="https://jawg.io">Jawg Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        minZoom={0}
        maxZoom={22}
      />
      <LocationMarker lat={lat} lng={lng} onSelect={onLocationSelect}/>
    </MapContainer>
  );
}