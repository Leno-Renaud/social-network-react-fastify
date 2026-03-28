import { useState } from 'react';
import styles from './SearchEvents.module.scss';
import Map from './Map/Map';
import { getEvents } from '../../Api/events.api';

export default function SearchEvents(){
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');

async function handleSearch(e){
        e.preventDefault();      
        if (!eventType || !eventDate) {
            setError("Veuillez sélectionner un type et une date");
            return;
        }
        try{
            setError('');
            const data = await getEvents(eventType, eventDate);
            setEvents(data);
        }
        catch(err){
            setError(err.message || "Impossible de charger les événements");
        }
    };

    return(
        <div className={styles.searchEvents}>
            <form onSubmit={handleSearch}>
                <label>Type d'évènement :</label>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                    <option value="">Choisir...</option>
                    <option value="soiree">Soirée</option>
                    <option value="concert">Concert</option>
                    <option value="sport">Sport</option>
                </select>

                <label>Date :</label>
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />

                <button type="submit">Chercher l'évènement</button>
            </form>
            {error && <p>{error}</p>}
            <div className={styles.mapWrapper}>
                <Map eventData={events}/>
            </div>
        </div>
    )
}