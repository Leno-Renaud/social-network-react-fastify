import { useState, useEffect, useContext } from "react";
import styles from "./HistoriqueEvenements.module.scss";
import { AuthContext } from "../../Context/AuthContext"; 
import CalendarIcon from "../../Assets/Calendar.png";
import PeopleIcon from "../../Assets/People.png";
import PinpointIcon from "../../Assets/Pinpoint.png";

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

export default function HistoriqueEvenements({ username }) {
    const [evenements, setEvenements] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [chargement, setChargement] = useState(true);

    const { user } = useContext(AuthContext);
    const targetUsername = username || user?.username;

    useEffect(() => {
        const fetchEvenements = async () => {
            try {
                const token = localStorage.getItem("token");
                const reponse = await fetch(`${API_URL}/getUserEvents/${targetUsername}`, {
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
                    
                    const evenementsPassés = donnees.filter(evt => {
                        const dateEvent = new Date(evt.startdate || evt.startDate);
                        return dateEvent < maintenant;
                    });
                    
                    evenementsPassés.sort((a, b) => {
                        const dateA = new Date(a.startdate || a.startDate);
                        const dateB = new Date(b.startdate || b.startDate);
                        return dateB - dateA;
                    });
                    
                    console.log("Données reçues:", donnees);
                    setEvenements(evenementsPassés);
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
            fetchEvenements();
        } else {
            setChargement(false);
        }
    }, [targetUsername]);

    const handleEventClick = (evt) => {
        setSelectedEvent(evt);
    };

    const handleBackClick = () => {
        setSelectedEvent(null);
    };

    if (chargement) {
        return <div className={styles.container}><h2>Chargement de vos événements...</h2></div>;
    }

    return (
        <div className={styles.container}>
            
            {selectedEvent ? (
                <div className={styles.detailsView}>
                    <button onClick={handleBackClick}>← Retour à l'historique</button>
                    <h2>{selectedEvent.title}</h2>
                    <p><strong><img className={styles.inlineIcon} src={PinpointIcon} alt="" aria-hidden="true" />Type :</strong> {selectedEvent.type}</p>
                    <p><strong><img className={styles.inlineIcon} src={PeopleIcon} alt="" aria-hidden="true" />Nombre de personnes :</strong> {selectedEvent.numberofpeople || selectedEvent.numberOfPeople || "Non spécifié"}</p>
                    <p><strong>Détails :</strong> {selectedEvent.description}</p>
                    <p><strong><img className={styles.inlineIcon} src={CalendarIcon} alt="" aria-hidden="true" />Date :</strong> {formatDate(selectedEvent.startdate || selectedEvent.startDate)}</p>
                </div>
            ) : (
                <>
                    <h2>{targetUsername === user?.username ? "Historique de mes événements" : `Historique de ${targetUsername}`}</h2>
                    <div className={styles.grid}>
                        {evenements.map((evt) => (
                            <div 
                                key={evt.id}
                                className={styles.eventCard} 
                                onClick={() => handleEventClick(evt)}
                            >
                                <div className={styles.cardContent}>
                                    <h3>{evt.title}</h3>
                                    <p className={styles.date}><img className={styles.inlineIcon} src={CalendarIcon} alt="" aria-hidden="true" />{formatDate(evt.startdate || evt.startDate)}</p>
                                    <p className={styles.people}><img className={styles.inlineIcon} src={PeopleIcon} alt="" aria-hidden="true" />Places : {evt.numberofpeople || evt.numberOfPeople || "N/A"}</p>
                                </div>
                            </div>
                        ))}
                        {evenements.length === 0 && (
                            <p style={{textAlign: "center", width: "100%"}}>Pas encore d'événements passés.</p>
                        )}
                    </div>
                </>
            )}

        </div>
    );
}