import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Composant qui gère le clic sur la carte
function LocationMarker({onSelect}) {
  // suavegarder localement
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click(e) {
      // e.latlng contient les coordonnées du clic
      const { lat, lng } = e.latlng;
      onSelect({ lat, lng });
      setPosition(e.latlng);
      // Optionnel : on centre la carte sur le clic
      map.flyTo(e.latlng, map.getZoom());
      
      //console.log("Coordonnées cliquées :", e.latlng.lat, e.latlng.lng);
    },
  });

  // Si on a une position, on affiche le marqueur
  return position === null ? null : (
    <Marker position={position}>
      {/* Popup à modifier pour que ça mette le titre de l'événement par exemple, ou bien le nom du lieu */ }
      <Popup>Tu as cliqué ici ! <br /> Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}</Popup>
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

export default function MapSelect({ onLocationSelect }) {
  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: "200px", width: "100%" }}>
      <TileLayer
        url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=gwzGSwSPdmnp9pR2RMiKU4NoHFJKWHJXTLBFquoMGzwWOlJfPF8Dc59MQSNrfto0"
        attribution='&copy; <a href="https://jawg.io">Jawg Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        minZoom={0}
        maxZoom={22}
      />
      <LocateUser />
      <LocationMarker onSelect={onLocationSelect}/>
    </MapContainer>
  );
}