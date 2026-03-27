
////// Orga de la page

////// A faire après :
// ce serait peut-être intéressant de garder l'adresse de l'événement en plus des coordonnées GPS
// pbm taille dans la base de données de openTo : type JSONB ou type TEXT ou type VARCHAR(1000) au moins
// quand on clique manuellement sur la carte, il faudrait que ça vide le champ de recherche
//////////////
import Search from '../geocoding/Geocoding';
//////////////
import { useState, useCallback } from 'react';
import styles from "./CreateEvent.module.scss"
import Toast from '../Toast/Toast';
import MapSelect from './MapSelect/MapSelect';
import MultiSelect from './MultiSelect/MultiSelect';
import { createEvent } from '../../Api/events.api';
//import { INSA_STRUCTURE } from './DptInsa/insaData';


export default function CreateEvent({ onCreate }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);

    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [startDate, setStartDate] = useState("");
    //const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState("");
    const [openTo, setOpenTo] = useState([]);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [lieu, setLieu] = useState("");

    const resetForm = () => {
        setTitle("");
        setType("");
        setStartDate("");
        setDescription("");
        setNumberOfPeople("");
        setOpenTo([]);
        setLat(null);
        setLng(null);
        setLieu("");
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
            setToast({ message: "Événement créé avec succès ! 🎉", type: "success" });
            resetForm();
            setTimeout(() => onCreate(false), 1500);

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

    const handleNbChange = (e) => {
        const val = parseInt(e.target.value);
        // Si l'utilisateur efface tout, on peut laisser vide temporairement 
        // OU forcer à 1 immédiatement :
        if (val < 1) {
            setNumberOfPeople(1);
        } 
        else if (isNaN(val)) {
            setNumberOfPeople("");
        }
        else {
            setNumberOfPeople(val);
        }
        };

    return(
        <>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className={styles.createEventContainer}>
            <h1>Créer un évènement</h1>
            <p className={styles.formNote}>
                Les champs précédés d'une <span>*</span> sont obligatoires.
            </p>
            <form onSubmit={submit} onKeyDown={(e) => { if (e.key === 'Enter') {e.preventDefault(); e.target.blur(); }}}>
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
                <Search lieu={lieu} onLocationSelect={(coords) => {setLat(coords.lat); setLng(coords.lng); }} onLieuSelect={setLieu} />
                <MapSelect lat={lat} lng={lng} onLieuSelect={setLieu} onLocationSelect={(coords) => {setLat(coords.lat); setLng(coords.lng); }} />
                <br />

                <label><span>*</span>Nombre de personnes : </label>
                <input type="number" min="1" value={numberOfPeople} onChange={handleNbChange} required />
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
        </>
    )
}