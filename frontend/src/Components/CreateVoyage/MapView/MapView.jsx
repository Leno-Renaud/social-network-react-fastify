import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

function LocationMarker({ lat, lng }) {
  const latNum = Number(lat);
  const lngNum = Number(lng);
  const hasValidCoords = lat !== null && lat !== undefined && lng !== null && lng !== undefined;

  const map = useMap();

  useEffect(() => {
    if (hasValidCoords) {
      map.flyTo([latNum, lngNum], map.getZoom());
    }
  }, [hasValidCoords, latNum, lngNum, map]);

  if (!hasValidCoords) return null;

  return (
    <Marker position={[latNum, lngNum]}>
      <Popup>
        Lieu de l'événement <br /> 
        Lat: {latNum.toFixed(4)}, Lng: {lngNum.toFixed(4)}
      </Popup>
    </Marker>
  );
}

export default function MapView({ lat, lng }) {
  return (
    <MapContainer
      center={[48.8566, 2.3522]}
      zoom={13}
      style={{ height: "200px", width: "100%", position: "relative", zIndex: 1 }}
    >
      <TileLayer
        url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=gwzGSwSPdmnp9pR2RMiKU4NoHFJKWHJXTLBFquoMGzwWOlJfPF8Dc59MQSNrfto0"
        attribution='&copy; <a href="https://jawg.io">Jawg Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        minZoom={0}
        maxZoom={22}
      />
      <LocationMarker lat={lat} lng={lng} />
    </MapContainer>
  );
}