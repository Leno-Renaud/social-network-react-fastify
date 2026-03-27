
////// Orga de la page

////// A faire après :
// backend : BD + submit
// plus jolis alerts event created successfully
import Search from '../geocoding/Geocoding';
import { useState } from 'react';
import styles from "./CreateVoyage.module.scss"
import MapView from './MapView/MapView';
import { createVoyage } from '../../Api/voyages.api';


export default function CreateVoyage({ onCreate }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    //const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState('');
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [lieu, setLieu] = useState("");

    const resetForm = () => {
        // setTitle("");
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

        // envoyer data au backend (BD)
        try{
            // console.log("startDate:", startDate);
            // console.log("endDate:", endDate);
            // console.log("description:", description);
            // console.log("Lieu :", lieu);
            const now = new Date();
            // On décale la date de l'offset local pour simuler l'heure locale en format ISO
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            // On récupère les 16 premiers caractères : "YYYY-MM-DDTHH:mm"
            const formattedDate = now.toISOString().slice(0, 16);
            // console.log(formattedDate); // Résultat : "2026-03-27T17:05"

            const response = await createVoyage(startDate, endDate, description, lieu, formattedDate);
            //alert("Voyage created successfully: " + JSON.stringify(response));
            alert("Voyage created successfully");
            resetForm();
            onCreate(false); // fermer le formulaire après création
        }
        catch(err){
            setError(err.message);
            //console.error("Error creating voyage:", err);
            //alert("Error creating voyage: " + err.message);
        }
        finally{
            setLoading(false);
        }

        //console.log("Données à envoyer au backend :", JSON.stringify(data,null,2));
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