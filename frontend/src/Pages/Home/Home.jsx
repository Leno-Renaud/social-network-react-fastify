import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContextObject';
import styles from './Home.module.scss';
import CalendarIcon from '../../Assets/Calendar.png';
import PlaneIcon from '../../Assets/Plane.png';
import PeopleIcon from '../../Assets/People.png';

export default function Home() {
    const { user } = useContext(AuthContext);

    if (user) {
        return (
            <div className={styles.dashboard}>
                <div className={styles.dashHero}>
                    <div className={styles.dashHeroText}>
                        <div className={styles.dashWelcome}>Bienvenue de retour</div>
                        <h1 className={styles.dashName}>{user.username}</h1>
                        <p className={styles.dashSub}>Prêt pour la prochaine aventure ?</p>
                    </div>
                </div>

                <div className={styles.dashSection}>
                    <h2 className={styles.dashSectionTitle}>Que veux-tu faire ?</h2>
                    <div className={styles.dashGrid}>
                        <Link to="/events" className={`${styles.dashCard} ${styles.cardBlue}`}>
                            <div className={styles.cardIconWrap}>
                                <img src={CalendarIcon} alt="Evenements" className={styles.cardIconImage} />
                            </div>
                            <div className={styles.cardBody}>
                                <strong>Explorer les événements</strong>
                                <span>Voir la carte des événements autour de toi</span>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>
                        <Link to="/matching" className={`${styles.dashCard} ${styles.cardPurple}`}>
                            <div className={styles.cardIconWrap}>
                                <img src={PlaneIcon} alt="Trouver un compagnon" className={styles.cardIconImage} />
                            </div>
                            <div className={styles.cardBody}>
                                <strong>Trouver un compagnon</strong>
                                <span>Matcher avec des voyageurs qui partagent ta destination</span>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>
                        <Link to="/chat" className={`${styles.dashCard} ${styles.cardGreen}`}>
                            <div className={styles.cardIconWrap}>
                                <img src={PeopleIcon} alt="Conversations" className={styles.cardIconImage} />
                            </div>
                            <div className={styles.cardBody}>
                                <strong>Mes conversations</strong>
                                <span>Rejoindre les chats de tes événements</span>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>
                    </div>
                </div>

                <div className={styles.dashTip}>
                    <p>Utilise le bouton <strong>+</strong> dans la barre de navigation pour créer un événement ou planifier un voyage.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.landing}>
            <section className={styles.hero}>
                <div className={styles.heroCard}>
                    <div className={styles.heroBadge}>Réseau social INSA</div>
                    <h1 className={styles.heroTitle}>
                        Le monde est plus beau<br />
                        <span className={styles.heroAccent}>à plusieurs</span>
                    </h1>
                    <p className={styles.heroText}>
                        TravelLink connecte les étudiants INSA qui partagent les mêmes destinations.
                        Rejoins des événements, trouve des compagnons de voyage et discute en temps réel.
                    </p>
                    <div className={styles.heroCta}>
                        <Link to="/register" className={styles.btnPrimary}>Rejoindre maintenant</Link>
                        <Link to="/login" className={styles.btnGhost}>Se connecter</Link>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <div className={styles.sectionHeaderCard}>
                    <div className={styles.sectionLabel}>Ce qu'on propose</div>
                    <h2 className={styles.sectionTitle}>Tout ce dont tu as besoin pour voyager</h2>
                </div>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <div className={`${styles.featureIcon} ${styles.blue}`}>
                            <img src={CalendarIcon} alt="Evenements" className={styles.featureIconImage} />
                        </div>
                        <h3>Événements sur carte</h3>
                        <p>Visualise les événements autour de toi sur une carte interactive. Filtre par type, date ou audience.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={`${styles.featureIcon} ${styles.purple}`}>
                            <img src={PlaneIcon} alt="Matching" className={styles.featureIconImage} />
                        </div>
                        <h3>Matching de voyages</h3>
                        <p>Tu pars à Rome en mars ? Trouve des INSA-iens qui font pareil. Voyage groupé, coûts réduits.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={`${styles.featureIcon} ${styles.green}`}>
                            <img src={PeopleIcon} alt="Conversations" className={styles.featureIconImage} />
                        </div>
                        <h3>Chat en temps réel</h3>
                        <p>Chaque événement a son propre chat. Organise, planifie et retrouve tes compagnons directement.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={`${styles.featureIcon} ${styles.orange}`}>
                            <img src={PeopleIcon} alt="Reseau INSA" className={styles.featureIconImage} />
                        </div>
                        <h3>Réseau INSA</h3>
                        <p>Réservé aux étudiants des campus INSA. Filtre par département, campus, ou promotion.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
