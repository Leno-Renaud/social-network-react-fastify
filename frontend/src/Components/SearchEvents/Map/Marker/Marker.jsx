import { useState } from "react";
import { Marker as LeafletMarker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import styles from "./Marker.module.scss";
import { INSA_STRUCTURE } from "../../../../Data/insaData";
import { joinEvent } from "../../../../Api/events.api";

function formatDateOnly(value) {
  if (!value) return "";
  const iso = String(value).split("T")[0];
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return String(value);
  return `${day}/${month}/${year}`;
}

function parseAudience(audience) {
  const selectedSet = new Set(audience);
  
  const audienceFinale = INSA_STRUCTURE.map(insa => {
    const selectedInThisInsa = insa.deps.filter(d => selectedSet.has(`${insa.id}-${d.id}`));

    if (selectedInThisInsa.length === insa.deps.length) {
      return insa.name;
    }
    return selectedInThisInsa.map(d => `${insa.name} - ${d.label}`);
  }).flat();
  const totalInsasSelected = INSA_STRUCTURE.filter(insa => audienceFinale.includes(insa.name)).length;
  
  if (totalInsasSelected === INSA_STRUCTURE.length) return ["Ouvert à tous"];
  return audienceFinale.length > 0 ? audienceFinale : audience;
}

export default function Marker({ position, event }) {
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  async function handleJoinEvent(eventId) {
    if (isJoining) return;

    try {
      setIsJoining(true);
      await joinEvent(eventId);
      navigate("/chat");
    } catch (error) {
      alert(error.message || "Impossible de rejoindre cet evenement");
    } finally {
      setIsJoining(false);
    }
  }

  const formattedDate = formatDateOnly(event.startdate);

  const audience = parseAudience(Array.isArray(event.opento)
    ? event.opento
    : String(event.opento || "")
        .replace(/[{}\"]/g, "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean));

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

          <button
            className={styles.joinButton}
            onClick={() => handleJoinEvent(event.id)}
            disabled={isJoining}
          >
            {isJoining ? "En cours..." : "Joindre"}
          </button>
        </article>
      </Popup>
    </LeafletMarker>
  );
}