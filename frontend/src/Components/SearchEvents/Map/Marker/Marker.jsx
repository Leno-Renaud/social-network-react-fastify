import { Marker as LeafletMarker, Popup } from "react-leaflet";
import styles from "./Marker.module.scss";

export default function Marker({ position, event }) {
  const formattedDate = new Date(event.startdate).toLocaleString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const audience = Array.isArray(event.opento)
    ? event.opento
    : String(event.opento || "")
        .replace(/[{}\"]/g, "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

  return (
    <LeafletMarker position={position}>
      <Popup>
        <article className={styles.card}>
          <header className={styles.header}>
            <h3 className={styles.title}>{event.title}</h3>
            <span className={styles.typeBadge}>{event.type}</span>
          </header>

          <div className={styles.metaRow}>
            <span className={styles.datePill}>{formattedDate}</span>
            <span className={styles.peoplePill}>{event.numberofpeople} places</span>
          </div>

          <p className={styles.description}>{event.description}</p>

          {audience.length > 0 && (
            <div className={styles.audienceRow}>
              {audience.map((group) => (
                <span key={group} className={styles.audienceTag}>
                  {group}
                </span>
              ))}
            </div>
          )}

          <button className={styles.joinButton} onClick={() => alert(`You clicked on event: ${event.id}`)}>Joindre</button>
        </article>
      </Popup>
    </LeafletMarker>
  );
}