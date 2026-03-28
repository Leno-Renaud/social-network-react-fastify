import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import HistoriqueEvenements from "../Components/HistoriqueEvenements/HistoriqueEvenements";
import EvenementsAVenir from "../Components/EvenementsAVenir/EvenementsAVenir";
import styles from "./Profile.module.scss";
import CalendarIcon from "../Assets/Calendar.png";

export default function Profile() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { username: routeUsername } = useParams();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") === "history" ? "history" : "upcoming");

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

  if (!user || !profileUsername) {
    return null;
  }

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
          <button 
            className={`${styles.tab} ${activeTab === "history" ? styles.active : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <img className={styles.tabIcon} src={CalendarIcon} alt="" aria-hidden="true" />
            Historique
          </button>
        </div>
      </div>

      <div className={styles.eventSection}>
        {activeTab === "upcoming" && isOwnProfile ? (
          <EvenementsAVenir />
        ) : (
          <HistoriqueEvenements username={profileUsername} />
        )}
      </div>
    </div>
  );
}