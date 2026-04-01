import { useContext, useState } from "react";
import styles from "./Register.module.scss"
import { register } from "../../Api/auth.api.js";
import { AuthContext } from "../../Context/AuthContextObject";
import { useNavigate } from "react-router-dom";

export default function Register(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [insa, setInsa] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.includes('@insa-')) {
            setError("L'email doit être une adresse INSA (ex: prenom.nom@insa-lyon.fr)");
            return;
        }

        setLoading(true);
        try {
            await register(username, password, email, insa);
            await loginUser(username, password);
            navigate("/")
        }
        catch(err){
            setError(err.message);
        }
        finally{
            setLoading(false);
        }
    }
    return(
        <form onSubmit={handleSubmit} className={styles.registerForm}>
            <h1>Register</h1>
            {error && <div className="error">{error}</div>}
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input type="email" placeholder="Email INSA (ex: prenom.nom@insa-lyon.fr)" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <select value={insa} onChange={(e) => setInsa(e.target.value)} required>
                <option value="">-- Votre INSA --</option>
                <option value="Lyon">INSA Lyon</option>
                <option value="Toulouse">INSA Toulouse</option>
                <option value="Rennes">INSA Rennes</option>
                <option value="Rouen">INSA Rouen Normandie</option>
                <option value="Strasbourg">INSA Strasbourg</option>
                <option value="Centre Val de Loire">INSA Centre Val de Loire</option>
                <option value="Hauts-de-France">INSA Hauts-de-France</option>
                <option value="Euro-Méditerranée">INSA Euro-Méditerranée</option>
            </select>
            <button type="submit" disabled={loading}>{loading ? 'Inscription...' : "S'inscrire"}</button>
        </form>
    )
}