import { useState } from "react";
import styles from "./HistoriqueEvenements.module.scss";

// Données simulées (Bouchon)
const fauxEvenements = [
    {
        id: 1,
        titre: "Soirée d'intégration",
        banniere: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
        lieu: "Foyer du Campus",
        noteMoyenne: "4.5/5",
        details: "La grande soirée annuelle pour accueillir la nouvelle promo. Au programme : DJ set, buffet et rencontres !",
        avis: [
            { id: 101, auteur: "Alex", note: 5, texte: "Incroyable ambiance, le DJ était top !" },
            { id: 102, auteur: "Marie", note: 4, texte: "Génial, mais la file d'attente pour le vestiaire était trop longue." }
        ]
    },
    {
        id: 2,
        titre: "Tournoi e-sport",
        banniere: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80",
        lieu: "Salle informatique",
        noteMoyenne: "5/5",
        details: "Tournoi Mario Kart et Smash Bros sur écran géant. Les gagnants remportent des goodies du BDE.",
        avis: [
            { id: 201, auteur: "Lucas", note: 5, texte: "Organisation parfaite, j'ai adoré les lots." },
            { id: 202, auteur: "Sophie", note: 3, texte: "Sympa, mais les manettes fatiguaient un peu." }
        ]
    }
];

export default function HistoriqueEvenements() {
    // Ce "state" permet de savoir quel événement est cliqué.
    // S'il est à 'null', on affiche la liste. S'il contient un événement, on affiche ses détails.
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Fonction déclenchée au clic sur une carte
    const handleEventClick = (evt) => {
        setSelectedEvent(evt);
    };

    // Fonction pour revenir à la liste
    const handleBackClick = () => {
        setSelectedEvent(null);
    };

    return (
        // J'ai enlevé le style en ligne, il prendra désormais la police de ton App !
        <div className={styles.container}>
            
            {selectedEvent ? (
                <div className={styles.detailsView}>
                    <button onClick={handleBackClick}>← Retour à l'historique</button>
                    <img src={selectedEvent.banniere} alt={selectedEvent.titre} />
                    <h2>{selectedEvent.titre}</h2>
                    <p><strong>📍 Lieu :</strong> {selectedEvent.lieu}</p>
                    <p><strong>⭐ Note globale :</strong> {selectedEvent.noteMoyenne}</p>
                    <p><strong>Détails :</strong> {selectedEvent.details}</p>
                    
                    {/* --- NOUVELLE SECTION AVIS --- */}
                    <div className={styles.avisSection}>
                        <h3>Avis des participants :</h3>
                        <div className={styles.listeAvis}>
                            {selectedEvent.avis.map((avis) => (
                                <div key={avis.id} className={styles.avisCard}>
                                    <div className={styles.avisHeader}>
                                        <strong>👤 {avis.auteur}</strong>
                                        {/* Astuce JS : on répète l'émoji étoile selon la note ! */}
                                        <span className={styles.etoiles}>
                                            {'★'.repeat(avis.note)}{'☆'.repeat(5 - avis.note)}
                                        </span>
                                    </div>
                                    <p>{avis.texte}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* ----------------------------- */}

                </div>
            ) : (
                <>
                    <h2>Historique de mes événements</h2>
                    <div className={styles.grid}>
                        {fauxEvenements.map((evt) => (
                            <div 
                                key={evt.id} 
                                className={styles.eventCard} 
                                onClick={() => handleEventClick(evt)}
                            >
                                <img src={evt.banniere} alt={evt.titre} />
                                <div className={styles.cardContent}>
                                    <h3>{evt.titre}</h3>
                                    <p>📍 {evt.lieu}</p>
                                    <p>⭐ {evt.noteMoyenne}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}