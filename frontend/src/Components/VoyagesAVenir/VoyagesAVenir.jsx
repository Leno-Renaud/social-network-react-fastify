import { useState, useEffect, useContext } from "react";
import styles from "./VoyagesAVenir.module.scss";
import { AuthContext } from "../../Context/AuthContextObject"; 
import CalendarIcon from "../../Assets/Calendar.png";
import MapDisplay from "../MapDisplay/MapDisplay";

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
    } catch {
        return "Date invalide";
    }
};

export default function VoyagesAVenir() {
    const [voyages, setVoyages] = useState([]);
    const [selectedVoyage, setSelectedVoyage] = useState(null);
    const [chargement, setChargement] = useState(true);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchVoyages = async () => {
            try {
                const token = localStorage.getItem("token");
                const reponse = await fetch(`${API_URL}/getUserVoyages/${user.username}`, {
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
                    
                    const voyagesFuturs = donnees.filter(voy => {
                        const dateVoyage = new Date(voy.startdate || voy.startDate);
                        return dateVoyage >= maintenant;
                    });

                    voyagesFuturs.sort((a, b) => {
                        const dateA = new Date(a.startdate || a.startDate);
                        const dateB = new Date(b.startdate || b.startDate);
                        return dateA - dateB;
                    });
                    
                    setVoyages(voyagesFuturs);
                } else {
                    console.log("Accès refusé ou erreur serveur (Code " + reponse.status + ")");
                }
            } catch (erreur) {
                console.log("Impossible de joindre le serveur", erreur);
            } finally {
                setChargement(false);
            }
        };

        if (user) {
            fetchVoyages();
        } else {
            setChargement(false);
            console.log("Pas d'utilisateur connecté, chargement annulé.");
        }
    }, [user]);

    const handleVoyageClick = (voy) => {
        setSelectedVoyage(voy);
    };

    const handleBackClick = () => {
        setSelectedVoyage(null);
    };

    if (chargement) {
        return <div className={styles.container}><h2>Chargement de vos voyages à venir...</h2></div>;
    }

    return (
        <div className={styles.container}>
            
            {selectedVoyage ? (
                <div className={styles.detailsView}>
                    <button onClick={handleBackClick}>← Retour à la liste</button>
                    <h2>{selectedVoyage.lieu}</h2>
                    <MapDisplay
                        lat={selectedVoyage.latitude ?? selectedVoyage.lat}
                        lng={selectedVoyage.longitude ?? selectedVoyage.lng}
                        title={selectedVoyage.lieu}
                    />
                    <p><strong>Détails :</strong> {selectedVoyage.description || "Non renseignés"}</p>
                    <p><strong><img className={styles.inlineIcon} src={CalendarIcon} alt="" aria-hidden="true" /></strong> {formatDate(selectedVoyage.startdate)} - {formatDate(selectedVoyage.enddate)}</p>
                </div>
            ) : (
                <>
                    <h2>Mes voyages à venir</h2>
                    <div className={styles.grid}>
                        {voyages.map((voy) => (
                            <div 
                                key={voy.id}
                                className={styles.voyageCard} 
                                onClick={() => handleVoyageClick(voy)}
                            >
                                <div className={styles.cardContent}>
                                    <h3>{voy.lieu}</h3>
                                    <p className={styles.date}><img className={styles.inlineIcon} src={CalendarIcon} alt="" aria-hidden="true" />{formatDate(voy.startdate)} - {formatDate(voy.enddate)}</p>
                                </div>
                            </div>
                        ))}

                        {voyages.length === 0 && (
                            <p style={{textAlign: "center", width: "100%"}}>Vous n'avez pas de voyages à venir.</p>
                        )}
                    </div>
                </>
            )}

        </div>
    );
}
