import { useState, useContext } from "react";
import styles from "./Login.module.scss"
import { useNavigate } from "react-router-dom";
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
        }
        catch(err){
            setError(err.message);
        }
        finally{
            setLoading(false);
        }
    }
    return(
        <form onSubmit={handleSubmit} className={styles.loginForm}>
            <h1>Login</h1>
            {error && <div className="error">{error}</div>}
            <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading}>{loading ? 'Login...' : 'Login'}</button>
        </form>
    )
}