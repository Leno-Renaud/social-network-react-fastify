import { useState } from 'react';
import styles from './SearchEvents.module.scss';
import Map from './Map/Map';

export default function SearchEvents(){
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        alert(`Type: ${eventType || 'non choisi'}\nDate: ${eventDate || 'non choisie'}`);
    };

    return(
        <div className={styles.searchEvents}>
            <form onSubmit={handleSearch}>
                <label>Type d'évènement :</label>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                    <option value="">Choisir...</option>
                    <option value="soirée">Soirée</option>
                    <option value="concert">Concert</option>
                    <option value="sport">Sport</option>
                </select>

                <br />

                <label>Date :</label>
                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />

                <br />

                <button type="submit">Chercher l'évènement</button>
            </form>
            <Map />
        </div>
    )
}