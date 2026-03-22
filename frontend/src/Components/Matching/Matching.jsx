import { useState, useContext } from "react";
import styles from "./Matching.module.scss";
import { getMatchingProfiles } from "../../Api/matching.api";
import { AuthContext } from "../../Context/AuthContext";

const Matching = () => {
  const { user } = useContext(AuthContext);

  const [filters, setFilters] = useState({
    lieu: "",
    dateDebut: "",
    dateFin: "",
  });

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await getMatchingProfiles(filters);
      setProfiles(data);
    } catch (err) {
      setError("Impossible de charger les profils. Réessaie plus tard.");
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
          Filtre par destination et dates pour rencontrer des voyageurs qui partagent tes projets.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSearch}>
        <div className={styles.filterGroup}>
          <label htmlFor="lieu" className={styles.label}>Destination</label>
          <input
            id="lieu"
            type="text"
            name="lieu"
            value={filters.lieu}
            onChange={handleFilterChange}
            placeholder="Ex : Tokyo, Lisbonne, Marrakech..."
            className={styles.input}
          />
        </div>

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
          <p className={styles.statusMsg}>Aucun voyageur trouvé, essaie d'élargir ta recherche !</p>
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
                  isCurrentUser={profile.id === user?.id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

const ProfileCard = ({ profile, isCurrentUser }) => {
  const [contacted, setContacted] = useState(false);

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
            🗓 {profile.dateDebut}{profile.dateFin ? ` → ${profile.dateFin}` : ""}
          </p>
        )}
        {profile.bio && <p className={styles.cardBio}>{profile.bio}</p>}
      </div>
      <button
        className={`${styles.btnContact} ${contacted ? styles.contacted : ""}`}
        onClick={() => setContacted(true)}
        disabled={contacted || isCurrentUser}
      >
        {isCurrentUser ? "C'est toi !" : contacted ? "✓ Contacté" : "Contacter"}
      </button>
    </div>
  );
};

export default Matching;