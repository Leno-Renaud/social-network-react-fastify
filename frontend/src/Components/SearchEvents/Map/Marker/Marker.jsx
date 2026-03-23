import { Marker as LeafletMarker, Popup } from "react-leaflet";
import styles from "./Marker.module.scss";
import { INSA_STRUCTURE } from "../../../../Data/insaData";

function parseAudience(audience) {
  // 1. Transformer l'audience en Set pour une recherche instantanée (performance)
  const selectedSet = new Set(audience);
  
  const audienceFinale = INSA_STRUCTURE.map(insa => {
    // 2. Identifier quels départements de cet INSA sont sélectionnés
    const selectedInThisInsa = insa.deps.filter(d => selectedSet.has(`${insa.id}-${d.id}`));

    // 3. Logique de décision :
    // Tout l'INSA est coché ? On renvoie juste le nom de l'INSA
    if (selectedInThisInsa.length === insa.deps.length) {
      return insa.name;
    }
    // Sinon, on renvoie la liste "INSA - Département"
    return selectedInThisInsa.map(d => `${insa.name} - ${d.label}`);
  }).flat(); // On "aplatit" le tableau de tableaux en un seul tableau simple

  // 4. Cas final : Si le nombre d'INSAs complets cochés égale le total, c'est "Ouvert à tous"
  const totalInsasSelected = INSA_STRUCTURE.filter(insa => audienceFinale.includes(insa.name)).length;
  
  if (totalInsasSelected === INSA_STRUCTURE.length) return ["Ouvert à tous"];
  return audienceFinale.length > 0 ? audienceFinale : audience;
}

export default function Marker({ position, event }) {
  const formattedDate = new Date(event.startdate).toLocaleString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

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

          <button className={styles.joinButton} onClick={() => alert(`You clicked on event: ${event.id}`)}>Joindre</button>
        </article>
      </Popup>
    </LeafletMarker>
  );
}