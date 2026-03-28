import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Matching.module.scss";
import { getMatchingProfiles, joinTravelCompanion } from "../../Api/matching.api";
import { AuthContext } from "../../Context/AuthContext";
import Search from '../geocoding/Geocoding';

function formatDate(value) {
  if (!value) return "";
  const iso = String(value).split("T")[0];
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return String(value);
  return `${day}/${month}/${year}`;
}

const Matching = () => {
  const { user } = useContext(AuthContext);

  const [filters, setFilters] = useState({
    lieu: "", // Sera mis à jour par Search
    dateDebut: "",
    dateFin: "",
  });

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Gestion des changements pour les dates uniquement
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Nouvelle fonction pour recevoir le lieu depuis le composant Search
  const handleLieuSelect = (selectedLieu) => {
    setFilters((prev) => ({ ...prev, lieu: selectedLieu }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    // Optionnel : empêcher la recherche si le lieu est vide
    if (!filters.lieu.trim()) {
      setError("Veuillez sélectionner une destination.");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await getMatchingProfiles(filters);
      setProfiles(data);
    } catch (err) {
      setError(err.message || "Impossible de charger les profils.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({ lieu: "", dateDebut: "", dateFin: "" });
    setProfiles([]);
    setHasSearched(false);
    setError(null);
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Trouve ton compagnon de voyage</h1>
        <p className={styles.subtitle}>
          Rencontre des voyageurs qui partagent tes projets de destination.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSearch}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Destination</label>
          {/* ✅ On utilise Search. On lui passe filters.lieu pour qu'il soit contrôlé */}
          <Search 
            lieu={filters.lieu} 
            voyage={true} 
            onLieuSelect={handleLieuSelect} 
          />
        </div>

        <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
            <label htmlFor="dateDebut" className={styles.label}>Date de départ</label>
            <input
                id="dateDebut"
                type="date"
                name="dateDebut"
                value={filters.dateDebut}
                onChange={handleFilterChange}
                className={styles.input}
            />
            </div>

            <div className={styles.filterGroup}>
            <label htmlFor="dateFin" className={styles.label}>Date de retour</label>
            <input
                id="dateFin"
                type="date"
                name="dateFin"
                value={filters.dateFin}
                onChange={handleFilterChange}
                className={styles.input}
            />
            </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnSearch} disabled={loading}>
            {loading ? "Recherche..." : "Rechercher"}
          </button>
          {hasSearched && (
            <button type="button" className={styles.btnReset} onClick={handleReset}>
              Réinitialiser
            </button>
          )}
        </div>
      </form>

      <div className={styles.results}>
        {loading && <p className={styles.statusMsg}>Recherche en cours...</p>}
        {error && !loading && <p className={styles.errorMsg}>{error}</p>}
        {!loading && hasSearched && !error && profiles.length === 0 && (
          <p className={styles.statusMsg}>Aucun voyageur trouvé pour cette destination.</p>
        )}
        {!loading && profiles.length > 0 && (
          <>
            <p className={styles.resultsCount}>
              {profiles.length} voyageur{profiles.length > 1 ? "s" : ""} trouvé{profiles.length > 1 ? "s" : ""}
            </p>
            <div className={styles.grid}>
              {profiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  isCurrentUser={profile.username === user?.username}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// ProfileCard reste inchangé
const ProfileCard = ({ profile, isCurrentUser }) => {
  const [isContacting, setIsContacting] = useState(false);
  const navigate = useNavigate();

  const handleContact = async () => {
    if (isCurrentUser || isContacting) return;
    try {
      setIsContacting(true);
      const response = await joinTravelCompanion(profile.id, profile.username);
      navigate(`/chat?conversationId=${response.eventId}`);
    } catch (error) {
      alert(error.message || "Impossible de contacter ce voyageur");
    } finally {
      setIsContacting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.avatar}>
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.username} />
        ) : (
          <span className={styles.avatarInitial}>
            {profile.username?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className={styles.cardInfo}>
        <h3 className={styles.cardName}>{profile.username}</h3>
        {profile.lieu && <p className={styles.cardDetail}>📍 {profile.lieu}</p>}
        {(profile.dateDebut || profile.dateFin) && (
          <p className={styles.cardDetail}>
            🗓 {formatDate(profile.dateDebut)}{profile.dateFin ? ` → ${formatDate(profile.dateFin)}` : ""}
          </p>
        )}
        {profile.bio && <p className={styles.cardBio}>{profile.bio}</p>}
      </div>
      <button
        className={`${styles.btnContact} ${isContacting ? styles.contacted : ""}`}
        onClick={handleContact}
        disabled={isContacting || isCurrentUser}
      >
        {isCurrentUser ? "Moi" : isContacting ? "Connexion..." : "Contacter"}
      </button>
    </div>
  );
};

export default Matching;