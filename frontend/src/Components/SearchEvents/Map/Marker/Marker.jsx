import { useState, useContext } from "react";
import { Marker as LeafletMarker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import styles from "./Marker.module.scss";
import { INSA_STRUCTURE } from "../../../../Data/insaData";
import { joinEvent } from "../../../../Api/events.api";
import { AuthContext } from "../../../../Context/AuthContextObject";

const INSA_ID_MAP = {
  "Lyon": "ly", "Strasbourg": "str", "Toulouse": "tou",
  "Rennes": "ren", "Rouen": "rou", "Centre Val de Loire": "cvl",
  "Hauts-de-France": "hdf", "Euro-Méditerranée": "em"
};

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
  const { user } = useContext(AuthContext);

  const openToArray = Array.isArray(event.opento)
    ? event.opento
    : String(event.opento || "").replace(/[{}"]/g, "").split(",").map(v => v.trim()).filter(Boolean);

  const userInsaId = user?.insa ? INSA_ID_MAP[user.insa] : null;
  const canJoin = !userInsaId || openToArray.some(dep => dep.startsWith(userInsaId + '-'));

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

  const audience = parseAudience(openToArray);

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
            disabled={isJoining || !canJoin}
            title={!canJoin ? `Réservé aux étudiants INSA ${openToArray.map(d => d.split('-')[0]).filter((v,i,a) => a.indexOf(v)===i).join(', ')}` : ""}
          >
            {isJoining ? "En cours..." : canJoin ? "Joindre" : "Non autorisé"}
          </button>
        </article>
      </Popup>
    </LeafletMarker>
  );
}