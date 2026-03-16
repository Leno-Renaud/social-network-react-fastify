import { Marker as LeafletMarker, Popup } from "react-leaflet";

export default function Marker({ position, popupText }) {
  return (
    <LeafletMarker position={position}>
      <Popup>{popupText}</Popup>
    </LeafletMarker>
  );
}