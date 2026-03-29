import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapDisplay({ lat, lng, title = "Localisation" }) {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return <div style={{ padding: "10px" }}>Localisation non disponible</div>;
  }

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{
        height: "200px",
        width: "100%",
        position: "relative",
        zIndex: 1,
        borderRadius: "8px",
        marginBottom: "15px"
      }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=gwzGSwSPdmnp9pR2RMiKU4NoHFJKWHJXTLBFquoMGzwWOlJfPF8Dc59MQSNrfto0"
        attribution='&copy; <a href="https://jawg.io">Jawg Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        minZoom={0}
        maxZoom={22}
      />
      <Marker position={[lat, lng]}>
        <Popup>
          {title} <br />
          Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
