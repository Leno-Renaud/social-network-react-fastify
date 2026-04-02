import Search from '../geocoding/Geocoding';
import { useState } from 'react';
import styles from "./CreateVoyage.module.scss"
import MapView from './MapView/MapView';
import { createVoyage } from '../../Api/voyages.api';

export default function CreateVoyage({ onCreate }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState('');
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [lieu, setLieu] = useState("");

    const resetForm = () => {
        setStartDate("");
        setEndDate("");
        setDescription("");
        setLieu("");
        setLat(null);
        setLng(null);
    };

    async function submit(e){
        e.preventDefault();
        setLoading(true);
        setError('');

        if (startDate >= endDate) {
            setError("La date de début doit être antérieure à la date de fin.");
            setLoading(false);
            return;
        }

        if (lieu.trim() === "") {
            setError("Veuillez entrer un lieu pour le voyage.");
            setLoading(false);
            return;
         }

        try{
            await createVoyage(lieu, startDate, endDate, description, lieu);
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

    return(
        <div className={styles.createVoyageContainer}>
            <h1>Créer un voyage</h1>
            <p className={styles.formNote}>
                Les champs précédés d'une <span>*</span> sont obligatoires.
            </p>
            <form onSubmit={submit}>

                <label><span>*</span>Où pars-tu ? Cherche une ville ou un pays</label>
                <Search lieu={lieu} voyage={true} onLocationSelect={(coords) => {setLat(coords.lat); setLng(coords.lng); }} onLieuSelect={setLieu} />
                <MapView lat={lat} lng={lng} onLocationSelect={(coords) => {setLat(coords.lat); setLng(coords.lng); }} />
                <br />

                <label><span>*</span>Date de début : </label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required/>
                <br />

                <label><span>*</span>Date fin : </label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                <br />

                <label>Description : </label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500}/>
                <br />

                {error && <div className={styles.error}>{"Erreur : " + error}</div>}
                <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Création...' : 'Créer le voyage'}
                </button>
            </form>
        </div>
    )

    }