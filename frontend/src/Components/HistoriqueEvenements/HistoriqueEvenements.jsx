import { useState, useEffect, useContext } from "react";
import styles from "./HistoriqueEvenements.module.scss";
// Assure-toi que le chemin vers AuthContext est le bon !
import { AuthContext } from "../../Context/AuthContext"; 

const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function HistoriqueEvenements() {
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
                    setEvenements(donnees);
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
        return <div className={styles.container}><h2>Chargement de vos événements...</h2></div>;
    }

    return (
        <div className={styles.container}>
            
            {selectedEvent ? (
                <div className={styles.detailsView}>
                    <button onClick={handleBackClick}>← Retour à l'historique</button>
                    {/* On a enlevé la banniere car elle n'est pas dans ta base de données actuelle */}
                    <h2>{selectedEvent.title}</h2>
                    <p><strong>📍 Type :</strong> {selectedEvent.type}</p>
                    <p><strong>👥 Nombre de personnes :</strong> {selectedEvent.numberOfPeople}</p>
                    <p><strong>Détails :</strong> {selectedEvent.description}</p>
                    <p><strong>📅 Date :</strong> {new Date(selectedEvent.startDate).toLocaleDateString()}</p>
                </div>
            ) : (
                <>
                    <h2>Historique de mes événements</h2>
                    <div className={styles.grid}>
                        {evenements.map((evt) => (
                            <div 
                                key={evt.id} // Assure-toi que ta BDD renvoie bien un id unique
                                className={styles.eventCard} 
                                onClick={() => handleEventClick(evt)}
                            >
                                <div className={styles.cardContent}>
                                    <h3>{evt.title}</h3>
                                    <p>📅 {new Date(evt.startDate).toLocaleDateString()}</p>
                                    <p>👥 Places : {evt.numberOfPeople}</p>
                                </div>
                            </div>
                        ))}
                        {/* Si le tableau est vide (0 événement) */}
                        {evenements.length === 0 && (
                            <p style={{textAlign: "center", width: "100%"}}>Vous n'avez pas encore d'événements.</p>
                        )}
                    </div>
                </>
            )}

        </div>
    );
}