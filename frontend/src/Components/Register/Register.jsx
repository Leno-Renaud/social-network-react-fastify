import { useContext, useState } from "react";
import styles from "./Register.module.scss"
import { register } from "../../Api/auth.api.js";
import { AuthContext } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { INSA_STRUCTURE } from "../../Data/insaData";

export default function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [insaId, setInsaId] = useState('');
    const [depId, setDepId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useContext(AuthContext)
    const navigate = useNavigate()

    const selectedInsa = INSA_STRUCTURE.find(i => i.id === insaId);

    const handleInsaChange = (e) => {
        setInsaId(e.target.value);
        setDepId('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) { setError("Le nom d'utilisateur est obligatoire."); return; }
        if (!password) { setError("Le mot de passe est obligatoire."); return; }
        if (!email.trim()) { setError("L'email est obligatoire."); return; }
        if (!/^[^@]+@insa-[^@]+\.fr$/.test(email)) { setError("L'email doit être une adresse @insa-....fr"); return; }
        if (!insaId) { setError("Veuillez sélectionner votre INSA."); return; }
        if (!depId) { setError("Veuillez sélectionner votre département."); return; }
        setLoading(true);
        setError('');
        const insa = `${insaId}-${depId}`;
        try {
            await register(username, password, insa, email);
            await loginUser(username, password);
            navigate("/")
        } catch(err){
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className={styles.page}>
            {/* GAUCHE */}
            <div className={styles.left}>
                <div className={styles.leftEmoji}>🌍</div>
                <h2 className={styles.leftTitle}>Rejoins la communauté<br/>des voyageurs</h2>
                <p className={styles.leftSub}>
                    Des milliers d'étudiants qui partagent destinations, bons plans et aventures.
                </p>
                <div className={styles.leftPerks}>
                    <div className={styles.perk}>
                        <span>🗺️</span><span>Découvre des événements près de toi</span>
                    </div>
                    <div className={styles.perk}>
                        <span>🤝</span><span>Trouve des compagnons de voyage</span>
                    </div>
                    <div className={styles.perk}>
                        <span>💬</span><span>Discute en temps réel</span>
                    </div>
                </div>
            </div>

            {/* DROITE */}
            <div className={styles.right}>
                <div className={styles.form}>
                    <div className={styles.formHeader}>
                        <h1>Créer un compte 🚀</h1>
                        <p>C'est gratuit et ça prend 30 secondes</p>
                    </div>

                    {error && <div className={styles.error}>⚠️ {error}</div>}

                    <div className={styles.fields}>
                        <div className={styles.field}>
                            <label htmlFor="username">Nom d'utilisateur</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Choisis un identifiant"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="email">Email INSA <span className={styles.required}>*</span></label>
                            <input
                                id="email"
                                type="email"
                                placeholder="prenom.nom@insa-lyon.fr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="insa">Ton INSA <span className={styles.required}>*</span></label>
                            <select
                                id="insa"
                                value={insaId}
                                onChange={handleInsaChange}
                                required
                            >
                                <option value="">Sélectionne ton campus...</option>
                                {INSA_STRUCTURE.map(i => (
                                    <option key={i.id} value={i.id}>{i.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="dep">Ton département <span className={styles.required}>*</span></label>
                            <select
                                id="dep"
                                value={depId}
                                onChange={(e) => setDepId(e.target.value)}
                                disabled={!insaId}
                                required
                            >
                                <option value="">{insaId ? 'Sélectionne ton département...' : 'Choisis d\'abord ton INSA'}</option>
                                {selectedInsa?.deps.map(d => (
                                    <option key={d.id} value={d.id}>{d.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'Création...' : 'Créer mon compte'}
                    </button>

                    <div className={styles.footer}>
                        Déjà un compte ? <Link to="/login">Se connecter</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
