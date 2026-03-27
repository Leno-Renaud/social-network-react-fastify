import { useState, useContext } from "react";
import styles from "./Login.module.scss"
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";

export default function Login(){
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
                <div className={styles.leftEmoji}>✈️</div>
                <h2 className={styles.leftTitle}>Le monde est plus beau<br/>à plusieurs</h2>
                <p className={styles.leftSub}>
                    Rejoins des étudiants qui voyagent ensemble, partagent leurs aventures et créent des souvenirs.
                </p>
                <p className={styles.leftQuote}>
                    "Voyager seul c'est bien. Voyager ensemble, c'est une aventure."
                </p>
            </div>

            {/* DROITE */}
            <div className={styles.right}>
                <div className={styles.form}>
                    <div className={styles.formHeader}>
                        <h1>Bon retour 👋</h1>
                        <p>Connecte-toi à ton compte TravelLink</p>
                    </div>

                    {error && <div className={styles.error}>⚠️ {error}</div>}

                    <div className={styles.fields}>
                        <div className={styles.field}>
                            <label htmlFor="username">Nom d'utilisateur</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Ton identifiant"
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
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>

                    <div className={styles.footer}>
                        Pas encore de compte ? <Link to="/register">S'inscrire gratuitement</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
