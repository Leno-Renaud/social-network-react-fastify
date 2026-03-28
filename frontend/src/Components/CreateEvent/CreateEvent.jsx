import Search from '../geocoding/Geocoding';
import { useState } from 'react';
import styles from "./CreateEvent.module.scss"
import MapSelect from './MapSelect/MapSelect';
import MultiSelect from './MultiSelect/MultiSelect';
import { createEvent } from '../../Api/events.api';

export default function CreateEvent({ onCreate }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [startDate, setStartDate] = useState("");
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
        try{
            const localization = { lat, lng }
            await createEvent(title, type, startDate, description, numberOfPeople, openTo, localization);
            alert("Event created successfully");
            resetForm();
            onCreate(false);

        }
        catch(err){
            setError(err.message);
        }
        finally{
            setLoading(false);
        }
    }

    const handleNbChange = (e) => {
        const val = parseInt(e.target.value);
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
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required/>
                <br />

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
    )

    }