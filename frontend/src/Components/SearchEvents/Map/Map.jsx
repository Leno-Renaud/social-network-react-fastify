import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import EventMarker from "./Marker/Marker";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [48.8566, 2.3522];

export default function Map({eventData}) {
  const [center, setCenter] = useState(DEFAULT_CENTER);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setCenter([coords.latitude, coords.longitude]);
    });
  }, []);

  return (
    <MapContainer key={center.join(",")} center={center} zoom={13} style={{ height: "400px" }}>
      <TileLayer
        url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=gwzGSwSPdmnp9pR2RMiKU4NoHFJKWHJXTLBFquoMGzwWOlJfPF8Dc59MQSNrfto0"
        attribution='&copy; <a href="https://jawg.io">Jawg Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        minZoom={0}
        maxZoom={22}
      />
      {Array.isArray(eventData) && eventData.map((event) => (
        <EventMarker
          key={event.id}
          position={[Number(event.latitude), Number(event.longitude)]}
          popupText={event.title}
        />
      ))}
    </MapContainer>
  );
}