import { useContext, useState } from "react";
import styles from "./Register.module.scss"
import { register } from "../../api/auth.jsx";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

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
            <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>
    )
}