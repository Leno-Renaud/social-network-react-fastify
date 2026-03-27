import { useContext, useState } from "react";
import styles from "./Register.module.scss"
import { register } from "../../Api/auth.api.js";
import { AuthContext } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(username, password);
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
