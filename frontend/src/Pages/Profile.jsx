import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import HistoriqueEvenements from "../Components/HistoriqueEvenements/HistoriqueEvenements";
import EvenementsAVenir from "../Components/EvenementsAVenir/EvenementsAVenir";
import HistoriqueVoyages from "../Components/HistoriqueVoyages/HistoriqueVoyages";
import VoyagesAVenir from "../Components/VoyagesAVenir/VoyagesAVenir";
import styles from "./Profile.module.scss";
import CalendarIcon from "../Assets/Calendar.png";

export default function Profile() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { username: routeUsername } = useParams();
  const [searchParams] = useSearchParams();

  // On définit l'onglet actif : "events" ou "voyages"
  const [activeTab, setActiveTab] = useState("events");
  // On définit le sous-filtre : "upcoming" ou "history"
  const [subFilter, setSubFilter] = useState(searchParams.get("tab") === "history" ? "history" : "upcoming");

  const profileUsername = routeUsername || user?.username;
  const isOwnProfile = profileUsername === user?.username;

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className={styles.container}><h2>Chargement...</h2></div>;
  }

  if (!user || !profileUsername) return null;

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <h1>{isOwnProfile ? "Mon Profil" : `Profil de ${profileUsername}`}</h1>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {profileUsername.charAt(0).toUpperCase()}
          </div>
          <div className={styles.details}>
            <p><strong>Nom d'utilisateur:</strong> {profileUsername}</p>
            {isOwnProfile && <p><strong>Email:</strong> {user.email || "Non renseigné"}</p>}
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {isOwnProfile && (
            <button 
              className={`${styles.tab} ${activeTab === "upcoming" ? styles.active : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              <img className={styles.tabIcon} src={CalendarIcon} alt="" aria-hidden="true" />
              Événements à venir
            </button>
          )}
        {/* Sélecteur principal : Événements VS Voyages */}
        <div className={styles.mainTabs}>
          <button 
            className={`${styles.tab} ${activeTab === "events" ? styles.active : ""}`}
            onClick={() => setActiveTab("events")}
          >
            <img className={styles.tabIcon} src={CalendarIcon} alt="" aria-hidden="true" />
            Événements
          </button>
          <button 
            className={`${styles.tab} ${activeTab === "voyages" ? styles.active : ""}`}
            onClick={() => setActiveTab("voyages")}
          >
            Voyages
          </button>
        </div>

        {/* Sous-sélecteur : À venir VS Historique */}
        <div className={styles.subTabs}>
          {isOwnProfile && <button 
            className={`${styles.subTab} ${subFilter === "upcoming" ? styles.subActive : ""}`}
            onClick={() => setSubFilter("upcoming")}
          >
            À venir
          </button>}
          <button 
            className={`${styles.subTab} ${subFilter === "history" ? styles.subActive : ""}`}
            onClick={() => setSubFilter("history")}
          >
            Historique
          </button>
        </div>
      </div>

      <div className={styles.contentSection}>
        {/* Logique d'affichage croisée */}
        {activeTab === "events" ? (
          subFilter === "upcoming" ? (
            <EvenementsAVenir username={profileUsername} isOwnProfile={isOwnProfile} />
          ) : (
            <HistoriqueEvenements username={profileUsername} />
          )
        ) : (
          subFilter === "upcoming" ? (
            <VoyagesAVenir username={profileUsername} isOwnProfile={isOwnProfile} />
          ) : (
            <HistoriqueVoyages username={profileUsername} />
          )
        )}
      </div>
    </div>
  );
}