import { useEffect, useState, useCallback } from 'react';
import { getMyEvents } from '../../Api/events.api';
import styles from './MyEvents.module.scss';

// ─── Countdown hook ───────────────────────────
function useCountdown(targetDate) {
    const calc = () => {
        const diff = new Date(targetDate) - new Date();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true };
        return {
            days:    Math.floor(diff / 86400000),
            hours:   Math.floor((diff % 86400000) / 3600000),
            minutes: Math.floor((diff % 3600000) / 60000),
            seconds: Math.floor((diff % 60000) / 1000),
            past: false,
        };
    };
    const [time, setTime] = useState(calc);
    useEffect(() => {
        const id = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return time;
}

// ─── Type badges ──────────────────────────────
const TYPE_META = {
    soiree:  { label: 'Soirée',  emoji: '🎉', color: '#f5f3ff', text: '#6d28d9' },
    concert: { label: 'Concert', emoji: '🎵', color: '#fdf4ff', text: '#a21caf' },
    sport:   { label: 'Sport',   emoji: '⚽', color: '#f0fdf4', text: '#15803d' },
    autre:   { label: 'Autre',   emoji: '📌', color: '#fffbeb', text: '#b45309' },
};

function getTypeMeta(type) {
    return TYPE_META[type] || TYPE_META.autre;
}

// ─── Countdown display ────────────────────────
function Countdown({ date }) {
    const { days, hours, minutes, seconds, past } = useCountdown(date);
    if (past) return <div className={styles.countdownPast}>Événement passé</div>;
    return (
        <div className={styles.countdown}>
            <div className={styles.countdownItem}>
                <span className={styles.countdownNum}>{String(days).padStart(2,'0')}</span>
                <span className={styles.countdownLabel}>jours</span>
            </div>
            <span className={styles.countdownSep}>:</span>
            <div className={styles.countdownItem}>
                <span className={styles.countdownNum}>{String(hours).padStart(2,'0')}</span>
                <span className={styles.countdownLabel}>heures</span>
            </div>
            <span className={styles.countdownSep}>:</span>
            <div className={styles.countdownItem}>
                <span className={styles.countdownNum}>{String(minutes).padStart(2,'0')}</span>
                <span className={styles.countdownLabel}>min</span>
            </div>
            <span className={styles.countdownSep}>:</span>
            <div className={styles.countdownItem}>
                <span className={styles.countdownNum}>{String(seconds).padStart(2,'0')}</span>
                <span className={styles.countdownLabel}>sec</span>
            </div>
        </div>
    );
}

// ─── Detail panel ─────────────────────────────
function EventDetail({ event, onClose }) {
    const meta = getTypeMeta(event.type);
    const date = new Date(event.startdate);

    return (
        <div className={styles.detailOverlay} onClick={onClose}>
            <div className={styles.detail} onClick={e => e.stopPropagation()}>
                <button className={styles.detailClose} onClick={onClose}>✕</button>

                <div className={styles.detailHeader} style={{ background: `linear-gradient(135deg, ${meta.text}cc, ${meta.text}88)` }}>
                    <span className={styles.detailEmoji}>{meta.emoji}</span>
                    <div>
                        <div className={styles.detailRole}>
                            {event.role === 'created' ? '👑 Créé par toi' : '🎟️ Rejoint'}
                        </div>
                        <h2 className={styles.detailTitle}>{event.title}</h2>
                        <p className={styles.detailType}>{meta.label}</p>
                    </div>
                </div>

                <div className={styles.detailBody}>
                    <div className={styles.detailCountdownWrap}>
                        <p className={styles.detailCountdownLabel}>Commence dans</p>
                        <Countdown date={event.startdate} />
                    </div>

                    <div className={styles.detailInfoGrid}>
                        <div className={styles.detailInfoItem}>
                            <span className={styles.detailInfoIcon}>📅</span>
                            <div>
                                <strong>Date</strong>
                                <span>{date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                <span>{date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        {event.numberopeople && (
                            <div className={styles.detailInfoItem}>
                                <span className={styles.detailInfoIcon}>👥</span>
                                <div>
                                    <strong>Participants max</strong>
                                    <span>{event.numberopeople} personnes</span>
                                </div>
                            </div>
                        )}

                        {event.username && (
                            <div className={styles.detailInfoItem}>
                                <span className={styles.detailInfoIcon}>👤</span>
                                <div>
                                    <strong>Organisateur</strong>
                                    <span>{event.username}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {event.description && (
                        <div className={styles.detailDescription}>
                            <strong>Description</strong>
                            <p>{event.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Event card ───────────────────────────────
function EventCard({ event, onClick }) {
    const meta = getTypeMeta(event.type);
    const date = new Date(event.startdate);
    const isPast = date < new Date();

    return (
        <div className={`${styles.card} ${isPast ? styles.pastCard : ''}`} onClick={onClick}>
            <div className={styles.cardAccent} style={{ background: meta.text }} />

            <div className={styles.cardTop}>
                <span className={styles.cardEmoji}>{meta.emoji}</span>
                <div className={styles.cardBadges}>
                    <span className={styles.typeBadge} style={{ background: meta.color, color: meta.text }}>
                        {meta.label}
                    </span>
                    <span className={`${styles.roleBadge} ${event.role === 'created' ? styles.roleCreated : styles.roleJoined}`}>
                        {event.role === 'created' ? '👑 Créé' : '🎟️ Rejoint'}
                    </span>
                </div>
            </div>

            <h3 className={styles.cardTitle}>{event.title}</h3>

            <div className={styles.cardDate}>
                📅 {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                {' · '}{date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </div>

            {!isPast && (
                <div className={styles.cardCountdown}>
                    <Countdown date={event.startdate} />
                </div>
            )}

            {isPast && <div className={styles.cardPastBadge}>Terminé</div>}

            <div className={styles.cardSeeMore}>Voir les détails →</div>
        </div>
    );
}

// ─── Main page ────────────────────────────────
export default function MyEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState('all'); // all | created | joined | upcoming | past

    useEffect(() => {
        getMyEvents()
            .then(setEvents)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = events.filter(e => {
        const isPast = new Date(e.startdate) < new Date();
        if (filter === 'created') return e.role === 'created';
        if (filter === 'joined')  return e.role === 'joined';
        if (filter === 'upcoming') return !isPast;
        if (filter === 'past')    return isPast;
        return true;
    });

    const upcoming = events.filter(e => new Date(e.startdate) >= new Date()).length;
    const created  = events.filter(e => e.role === 'created').length;
    const joined   = events.filter(e => e.role === 'joined').length;

    return (
        <div className={styles.page}>
            {/* BANNER */}
            <div className={styles.banner}>
                <div className={styles.bannerText}>
                    <h1>Mes événements</h1>
                    <p>Tous tes événements créés et rejoints</p>
                </div>
                <div className={styles.bannerStats}>
                    <div className={styles.stat}><strong>{upcoming}</strong><span>À venir</span></div>
                    <div className={styles.statDiv}/>
                    <div className={styles.stat}><strong>{created}</strong><span>Créés</span></div>
                    <div className={styles.statDiv}/>
                    <div className={styles.stat}><strong>{joined}</strong><span>Rejoints</span></div>
                </div>
            </div>

            <div className={styles.content}>
                {/* FILTRES */}
                <div className={styles.filters}>
                    {[
                        { key: 'all',      label: 'Tous' },
                        { key: 'upcoming', label: '⏳ À venir' },
                        { key: 'created',  label: '👑 Créés' },
                        { key: 'joined',   label: '🎟️ Rejoints' },
                        { key: 'past',     label: '✓ Passés' },
                    ].map(f => (
                        <button
                            key={f.key}
                            className={`${styles.filterBtn} ${filter === f.key ? styles.active : ''}`}
                            onClick={() => setFilter(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* CONTENU */}
                {loading && <div className={styles.statusMsg}>Chargement...</div>}
                {error   && <div className={styles.errorMsg}>{error}</div>}
                {!loading && !error && filtered.length === 0 && (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>📭</div>
                        <h3>Aucun événement</h3>
                        <p>Crée ou rejoins un événement pour le voir apparaître ici.</p>
                    </div>
                )}
                {!loading && filtered.length > 0 && (
                    <div className={styles.grid}>
                        {filtered.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onClick={() => setSelected(event)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selected && <EventDetail event={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}
