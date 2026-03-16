
////// Orga de la page
// Titre ok
// Date (début et fin) ok
// Type d'évènement ok
// Description ok
// Localisation -
// Nombre de personnes ok
// Ouvert à qui ? Quels INSA, quels départements, etc. ok
// Un bouton pour valider la création de l'événement (transformation des données en JSON et envoi au backend)

////// A faire après :
// un bouton qui ouvre le formulaire pour créer un événement
// transformer les dates en vraies dates et pas juste des strings : new Date(data.startDate).toISOString()
// que ça reload pas à chaque fois que je fais entrer
// apparence
// trouver un moyen de récupérer les départs de l'INSA pour les proposer dans une liste déroulante ? ou bien les stocker dans la BD et aller les chercher?
/// + possibilité de faire une catégorie "départements" et "insa"
// d'autres types d'évènements ?
// meilleur multiselect https://codeshack.io/multi-select-dropdown-html-javascript/
// vérifier que la date de début < date de fin
// tester quand on modifie une valeur rentrée, voir si ça modifie bien le JSON envoyé au backend

import React, { useState } from 'react';
import styles from "./CreateEvent.module.scss"
import MapSelect from './MapSelect/MapSelect';
import { createEvent } from '../../Api/events';

// à stocker dans la base de données ? une table départements associés avec leur insa
const insas = [
  { id: 'cvl', label: 'INSA Centre Val de Loire' },
  { id: 'hdf', label: 'INSA Hauts-de-France' },
  { id: 'lyon', label: 'INSA Lyon' },
  { id: 'rennes', label: 'INSA Rennes' },
  { id: 'rouen', label: 'INSA Rouen Normandie' },
  { id: 'stras', label: 'INSA Strasbourg' },
  { id: 'toulouse', label: 'INSA Toulouse' },
];

export default function CreateEvent({ onCreate }) {
    // const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [startDate, setStartDate] = useState("");
    //const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState("");
    const [openTo, setOpenTo] = useState([]);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);

    async function submit(e){
        e.preventDefault();
        // envoyer data au backend (BD)
        try{
            const response = await createEvent(title, type, startDate, description, numberOfPeople, openTo, localization);
            alert("Event created successfully: " + JSON.stringify(response));
        }
        catch(err){
            console.error("Error creating event:", err);
            alert("Error creating event: " + err.message);
        }

        console.log("Données à envoyer au backend :", JSON.stringify(data,null,2));
    }

    const handleCheckboxChange = (id) => {
    //console.log("avant : ", openTo);
    setOpenTo((prev) => {
        
        if (prev.includes(id)) {
        // Si l'ID est déjà là, on crée un NOUVEAU tableau sans cet ID
        return prev.filter((item) => item !== id);
        } else {
        // Sinon, on crée un NOUVEAU tableau avec l'ID ajouté
        return [...prev, id];
        }
    });
    };

    return(
        <div>
            <h1>Créer un évènement</h1>
            <form onSubmit={submit}>
                <label>Titre : </label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                <br />

                <label>Type d'évènement : </label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Choisir...</option>
                    <option value="soiree">Soirée</option>
                    <option value="concert">Concert</option>
                    <option value="sport">Sport</option>
                </select>
                <br />

                <label>Date début : </label>
                <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <br />

                {/*<label>Date fin : </label>
                <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <br />*/}

                <label>Description : </label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                <br />

                <label>Localisation : </label>
                <MapSelect onLocationSelect={(coords) => {setLat(coords.lat); setLng(coords.lng); }} />
                <br />

                <label>Nombre de personnes : </label>
                <input type="number" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} />
                <br />

                <label>Ouvert à qui ? </label>
                <div className={styles.selectorContainer}>                
                <div className={styles.scrollBox}>
                    {insas.map((insa) => (
                    <div key={insa.id} className={styles.optionItem}>
                        <label>
                        <input
                            type="checkbox"
                            checked={openTo.includes(insa.id)}
                            onChange={() => handleCheckboxChange(insa.id)}
                        />
                        {insa.label}
                        </label>
                    </div>
                    ))}
                </div>
                </div>
                <br />

                <button type="submit">Créer l'évènement</button>
            </form>
        </div>
    )

    }