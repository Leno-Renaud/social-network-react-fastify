import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContextObject";
import HistoriqueEvenements from "../../Components/HistoriqueEvenements/HistoriqueEvenements";
import EvenementsAVenir from "../../Components/EvenementsAVenir/EvenementsAVenir";
import HistoriqueVoyages from "../../Components/HistoriqueVoyages/HistoriqueVoyages";
import VoyagesAVenir from "../../Components/VoyagesAVenir/VoyagesAVenir";
import styles from "./Profile.module.scss";
import CalendarIcon from "../../Assets/Calendar.png";

export default function Profile() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { username: routeUsername } = useParams();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState("events");

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

        <div className={styles.mainTabs}>
          {isOwnProfile && (
            <button
              className={`${styles.tab} ${subFilter === "upcoming" ? styles.active : ""}`}
              onClick={() => setSubFilter("upcoming")}
            >
              À venir
            </button>
          )}
          <button
            className={`${styles.tab} ${subFilter === "history" ? styles.active : ""}`}
            onClick={() => setSubFilter("history")}
          >
            Historique
          </button>
        </div>
      </div>

      <div className={styles.eventSection}>
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