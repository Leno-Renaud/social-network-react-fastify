
////// Orga de la page

////// A faire après :
// vérifier que la date de début < date de fin
// ce serait peut-être intéressant de garder l'adresse de l'événement en plus des coordonnées GPS
// pbm taille dans la base de données de openTo : type JSONB ou type TEXT ou type VARCHAR(1000) au moins
//////////////
import Search from './TEST-geocoding/Geocoding';
//////////////
import React, { useState } from 'react';
import styles from "./CreateEvent.module.scss"
import MapSelect from './MapSelect/MapSelect';
import MultiSelect from './MultiSelect/MultiSelect';
import { createEvent } from '../../Api/events';
//import { INSA_STRUCTURE } from './DptInsa/insaData';


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
        if (openTo.length === 0) {
            setError("Veuillez sélectionner au moins une option pour 'Ouvert à'.");
            setLoading(false);
            return;
        }
        // envoyer data au backend (BD)
        try{
            const localization = { lat, lng }
            // console.log("title:", title);
            // console.log("type:", type);
            // console.log("startDate:", startDate);
            // console.log("description:", description);
            // console.log("numberOfPeople:", numberOfPeople);
            console.log("openTo:", openTo);
            // console.log("Localisation :", localization);
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
                <label><span>*</span>Titre : </label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                <br />

                <label><span>*</span>Type d'évènement : </label>
                <select value={type} onChange={(e) => setType(e.target.value)} required>
                    <option value="">Choisir...</option>
                    <option value="soiree">Soirée</option>
                    <option value="concert">Concert</option>
                    <option value="sport">Sport</option>
                    <option value="autre">Autre</option>
                </select>
                <br />

                <label><span>*</span>Date de début : </label>
                <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required/>
                <br />

                {/*<label>Date fin : </label>
                <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <br />*/}

                <label>Description : </label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500}/>
                <br />

                <label><span>*</span>Localisation : </label>
                <Search onLocationSelect={(coords) => {setLat(coords.lat); setLng(coords.lng); }} />
                <MapSelect lat={lat} lng={lng} onLocationSelect={(coords) => {setLat(coords.lat); setLng(coords.lng); }} />
                <br />

                <label><span>*</span>Nombre de personnes : </label>
                <input type="number" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} required />
                <br />

                <label><span>*</span>Ouvert à qui ? </label>
                <MultiSelect selectedDeps={openTo} setSelectedDeps={setOpenTo} />
                <br />

                {error && <div className={styles.error}>{"Erreur : " + error}</div>}
                <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Création...' : 'Créer l\'évènement'}
                </button>
            </form>
        </div>
    )

    }