
////// Orga de la page

////// A faire après :
// un bouton qui ouvre le formulaire pour créer un événement
// apparence
// trouver un moyen de récupérer les départs de l'INSA pour les proposer dans une liste déroulante ? ou bien les stocker dans la BD et aller les chercher?
/// + possibilité de faire une catégorie "départements" et "insa"
// meilleur multiselect https://codeshack.io/multi-select-dropdown-html-javascript/
// vérifier que la date de début < date de fin

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [startDate, setStartDate] = useState("");
    //const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState("");
    const [openTo, setOpenTo] = useState([]);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);

    const resetForm = () => {
        setTitle("");
        setType("");
        setStartDate("");
        setDescription("");
        setNumberOfPeople("");
        setOpenTo([]);
        setLat(null);
        setLng(null);
    };

    async function submit(e){
        e.preventDefault();
        setLoading(true);
        setError('');
        if (!lat || !lng) {
            setError("Veuillez sélectionner une localisation sur la carte.");
            setLoading(false);
            return;
        }
        // envoyer data au backend (BD)
        try{
            const localization = { lat, lng }
            console.log("Localisation :", localization);
            const response = await createEvent(title, type, startDate, description, numberOfPeople, openTo, localization);
            //alert("Event created successfully: " + JSON.stringify(response));
            alert("Event created successfully");
            resetForm();
            onCreate(false); // fermer le formulaire après création
        }
        catch(err){
            setError(err.message);
            //console.error("Error creating event:", err);
            //alert("Error creating event: " + err.message);
        }
        finally{
            setLoading(false);
        }

        //console.log("Données à envoyer au backend :", JSON.stringify(data,null,2));
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
        <div className={styles.createEventContainer}>
            <h1>Créer un évènement</h1>
            <p className={styles.formNote}>
                Les champs précédés d'une <span>*</span> sont obligatoires.
            </p>
            <form onSubmit={submit}>
                <label>*Titre : </label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                <br />

                <label>*Type d'évènement : </label>
                <select value={type} onChange={(e) => setType(e.target.value)} required>
                    <option value="">Choisir...</option>
                    <option value="soiree">Soirée</option>
                    <option value="concert">Concert</option>
                    <option value="sport">Sport</option>
                    <option value="autre">Autre</option>
                </select>
                <br />

                <label>*Date de début : </label>
                <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required/>
                <br />

                {/*<label>Date fin : </label>
                <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <br />*/}

                <label>Description : </label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                <br />

                <label>*Localisation : </label>
                <MapSelect onLocationSelect={(coords) => {setLat(coords.lat); setLng(coords.lng); }} />
                <br />

                <label>Nombre de personnes : </label>
                <input type="number" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} required />
                <br />

                <label>*Ouvert à qui ? </label>
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

                {error && <div className={styles.error}>{"Erreur : " + error}</div>}
                <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Création...' : 'Créer l\'évènement'}
                </button>
            </form>
        </div>
    )

    }