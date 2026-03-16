import { useState } from 'react';
import styles from './SearchEvents.module.scss';
import Map from './Map/Map';
import { getEvents } from '../../Api/events';

export default function SearchEvents(){
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [events, setEvents] = useState([]);

async function handleSearch(e){
        e.preventDefault();      
        if (!eventType || !eventDate) {
            alert("Veuillez sélectionner un type et une date");
            return;
        }
        try{
            const data = await getEvents(eventType, eventDate);
            setEvents(data);
        }
        catch(err){
            console.error("Error fetching events:", err);
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

                <br />

                <label>Date :</label>
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />

                <br />

                <button type="submit">Chercher l'évènement</button>
            </form>
            <Map eventData={events}/>
        </div>
    )
}