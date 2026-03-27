import { useState, useEffect, useContext } from "react";
import styles from "./EvenementsAVenir.module.scss";
import { AuthContext } from "../../Context/AuthContext"; 

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Fonction pour formater les dates correctement
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

export default function EvenementsAVenir() {
    const [evenements, setEvenements] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [chargement, setChargement] = useState(true);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchEvenements = async () => {
            try {
                const token = localStorage.getItem("token");
                const reponse = await fetch(`${API_URL}/getUserEvents/${user.username}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }); 
                
                if (reponse.ok) {
                    const donnees = await reponse.json();
                    // Filtrer les événements à venir (après aujourd'hui)
                    const maintenant = new Date();
                    maintenant.setHours(0, 0, 0, 0);
                    
                    const evenementsFuturs = donnees.filter(evt => {
                        const dateEvent = new Date(evt.startdate || evt.startDate);
                        return dateEvent >= maintenant;
                    });
                    
                    // Trier par date croissante
                    evenementsFuturs.sort((a, b) => {
                        const dateA = new Date(a.startdate || a.startDate);
                        const dateB = new Date(b.startdate || b.startDate);
                        return dateA - dateB;
                    });
                    
                    setEvenements(evenementsFuturs);
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
            fetchEvenements();
        } else {
            setChargement(false);
            console.log("Pas d'utilisateur connecté, chargement annulé.");
        }
    }, [user]);

    const handleEventClick = (evt) => {
        setSelectedEvent(evt);
    };

    const handleBackClick = () => {
        setSelectedEvent(null);
    };

    if (chargement) {
        return <div className={styles.container}><h2>Chargement de vos événements à venir...</h2></div>;
    }

    return (
        <div className={styles.container}>
            
            {selectedEvent ? (
                <div className={styles.detailsView}>
                    <button onClick={handleBackClick}>← Retour à la liste</button>
                    <h2>{selectedEvent.title}</h2>
                    <p><strong>📍 Type :</strong> {selectedEvent.type}</p>
                    <p><strong>👥 Nombre de personnes :</strong> {selectedEvent.numberofpeople || selectedEvent.numberOfPeople || "Non spécifié"}</p>
                    <p><strong>Détails :</strong> {selectedEvent.description}</p>
                    <p><strong>📅 Date :</strong> {formatDate(selectedEvent.startdate || selectedEvent.startDate)}</p>
                    <p><strong>📍 Localisation :</strong> Latitude: {selectedEvent.latitude}, Longitude: {selectedEvent.longitude}</p>
                </div>
            ) : (
                <>
                    <h2>Mes événements à venir</h2>
                    <div className={styles.grid}>
                        {evenements.map((evt) => (
                            <div 
                                key={evt.id}
                                className={styles.eventCard} 
                                onClick={() => handleEventClick(evt)}
                            >
                                <div className={styles.cardContent}>
                                    <h3>{evt.title}</h3>
                                    <p className={styles.date}>📅 {formatDate(evt.startdate || evt.startDate)}</p>
                                    <p className={styles.people}>👥 Places : {evt.numberofpeople || evt.numberOfPeople || "N/A"}</p>
                                </div>
                            </div>
                        ))}
                        {/* Si le tableau est vide (0 événement) */}
                        {evenements.length === 0 && (
                            <p style={{textAlign: "center", width: "100%"}}>Vous n'avez pas d'événements à venir.</p>
                        )}
                    </div>
                </>
            )}

        </div>
    );
}
