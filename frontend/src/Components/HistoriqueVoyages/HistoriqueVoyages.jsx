import { useState, useEffect, useContext } from "react";
import styles from "./HistoriqueVoyages.module.scss";
import { AuthContext } from "../../Context/AuthContext"; 

const API_URL = import.meta.env.VITE_BACKEND_URL;

const formatDate = (dateString) => {
    if (!dateString) return "Date invalide";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Date invalide";
        }
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return "Date invalide";
    }
};

export default function HistoriqueVoyages({ username }) {
    const [voyages, setVoyages] = useState([]);
    const [selectedVoyage, setSelectedVoyage] = useState(null);
    const [chargement, setChargement] = useState(true);

    const { user } = useContext(AuthContext);
    const targetUsername = username || user?.username;

    useEffect(() => {
        const fetchVoyages = async () => {
            try {
                const token = localStorage.getItem("token");
                const reponse = await fetch(`${API_URL}/getUserVoyages/${targetUsername}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }); 
                
                if (reponse.ok) {
                    const donnees = await reponse.json();
                    const maintenant = new Date();
                    maintenant.setHours(0, 0, 0, 0);
                    
                    const voyagesPassés = donnees.filter(voy => {
                        const dateVoyage = new Date(voy.startdate || voy.startDate);
                        return dateVoyage < maintenant;
                    });
                    
                    voyagesPassés.sort((a, b) => {
                        const dateA = new Date(a.startdate || a.startDate);
                        const dateB = new Date(b.startdate || b.startDate);
                        return dateB - dateA;
                    });
                    
                    console.log("Données reçues:", donnees);
                    setVoyages(voyagesPassés);
                } else {
                    console.log("Accès refusé ou erreur serveur (Code " + reponse.status + ")");
                }
            } catch (erreur) {
                console.log("Impossible de joindre le serveur", erreur);
            } finally {
                setChargement(false);
            }
        };

        if (targetUsername) {
            fetchVoyages();
        } else {
            setChargement(false);
        }
    }, [targetUsername]);

    const handleVoyageClick = (voy) => {
        setSelectedVoyage(voy);
    };

    const handleBackClick = () => {
        setSelectedVoyage(null);
    };

    if (chargement) {
        return <div className={styles.container}><h2>Chargement de vos voyages...</h2></div>;
    }

    return (
        <div className={styles.container}>
            
            {selectedVoyage ? (
                <div className={styles.detailsView}>
                    <button onClick={handleBackClick}>← Retour à l'historique</button>
                    <h2>{selectedVoyage.lieu}</h2>
                    <p><strong>Détails :</strong> {selectedVoyage.description || "Non renseignés"}</p>
                    <p><strong>📅 </strong> {formatDate(selectedVoyage.startdate)} - {formatDate(selectedVoyage.enddate)}</p>
                </div>
            ) : (
                <>
                    <h2>{targetUsername === user?.username ? "Historique de mes voyages" : `Historique de ${targetUsername}`}</h2>
                    <div className={styles.grid}>
                        {voyages.map((voy) => (
                            <div 
                                key={voy.id}
                                className={styles.voyageCard} 
                                onClick={() => handleVoyageClick(voy)}
                            >
                                <div className={styles.cardContent}>
                                    <h3>{voy.lieu}</h3>
                                    <p className={styles.date}>📅 {formatDate(voy.startdate)} - {formatDate(voy.enddate)}</p>
                                </div>
                            </div>
                        ))}
                        {voyages.length === 0 && (
                            <p style={{textAlign: "center", width: "100%"}}>Pas encore de voyages passés.</p>
                        )}
                    </div>
                </>
            )}

        </div>
    );
}