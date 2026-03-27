import { useState } from 'react';
import styles from './SearchEvents.module.scss';
import Map from './Map/Map';
import { getEvents } from '../../Api/events.api';

export default function SearchEvents(){
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSearch(e){
        e.preventDefault();
        if (!eventType || !eventDate) {
            setError("Sélectionne un type et une date.");
            return;
        }
        setError('');
        setLoading(true);
        try {
            const data = await getEvents(eventType, eventDate);
            setEvents(data);
        } catch(err) {
            setError("Impossible de charger les événements.");
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className={styles.page}>
            <div className={styles.topBar}>
                <div className={styles.topBarInner}>
                    <div className={styles.topBarTitle}>
                        <span className={styles.topBarIcon}>🗺️</span>
                        <div>
                            <h1>Événements</h1>
                            <p>Explore ce qui se passe près de toi</p>
                        </div>
                    </div>
                    <form onSubmit={handleSearch} className={styles.searchForm}>
                        <div className={styles.field}>
                            <label>Type</label>
                            <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                                <option value="">Tous les types</option>
                                <option value="soiree">Soirée</option>
                                <option value="concert">Concert</option>
                                <option value="sport">Sport</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Date</label>
                            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                        </div>
                        <button type="submit" className={styles.searchBtn} disabled={loading}>
                            {loading ? '...' : 'Rechercher'}
                        </button>
                    </form>
                </div>
                {error && <div className={styles.error}>{error}</div>}
            </div>
            <div className={styles.mapWrapper}>
                <Map eventData={events}/>
            </div>
        </div>
    )
}
