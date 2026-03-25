import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import HistoriqueEvenements from "../Components/HistoriqueEvenements/HistoriqueEvenements";
import EvenementsAVenir from "../Components/EvenementsAVenir/EvenementsAVenir";
import styles from "./Profile.module.scss";

export default function Profile() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className={styles.container}><h2>Chargement...</h2></div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <h1>Mon Profil</h1>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className={styles.details}>
            <p><strong>Nom d'utilisateur:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email || "Non renseigné"}</p>
          </div>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === "upcoming" ? styles.active : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            📅 Événements à venir
          </button>
          <button 
            className={`${styles.tab} ${activeTab === "history" ? styles.active : ""}`}
            onClick={() => setActiveTab("history")}
          >
            📜 Historique
          </button>
        </div>
      </div>

      <div className={styles.eventSection}>
        {activeTab === "upcoming" ? (
          <EvenementsAVenir />
        ) : (
          <HistoriqueEvenements />
        )}
      </div>
    </div>
  );
}