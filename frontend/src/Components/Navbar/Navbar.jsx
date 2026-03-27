import { Link, NavLink, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.scss'
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import CreateButton from '../CreateButton/CreateButton';

export default function Navbar(){
    const { user, logoutUser } = useContext(AuthContext)
    const navigate = useNavigate()

    function logout(){
        logoutUser()
        navigate("/login")
    }

    const navLinkClass = ({ isActive }) =>
        `${styles.navLink} ${isActive ? styles.active : ''}`

    return(
        <nav className={styles.navbar}>
            <Link to="/" className={styles.brand}>TravelLink</Link>

            {user && (
                <div className={styles.navLinks}>
                    <NavLink to="/" className={navLinkClass} end>Accueil</NavLink>
                    <NavLink to="/events" className={navLinkClass}>Événements</NavLink>
                    <NavLink to="/matching" className={navLinkClass}>Matching</NavLink>
                    <NavLink to="/chat" className={navLinkClass}>Chat</NavLink>
                    <NavLink to="/my-events" className={navLinkClass}>Mes événements</NavLink>
                </div>
            )}

            <div className={styles.authLinks}>
                {user ? (
                    <div className={styles.userArea}>
                        <CreateButton />
                        <NavLink to="/profile" className={styles.avatarLink}>
                            <div className={styles.avatar}>
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        </NavLink>
                        <span className={styles.username}>{user.username}</span>
                        <button className={styles.logoutBtn} onClick={logout}>Déconnexion</button>
                    </div>
                ) : (
                    <>
                        <Link to="/login" className={`${styles.authLink} ${styles.login}`}>Connexion</Link>
                        <Link to="/register" className={`${styles.authLink} ${styles.register}`}>S'inscrire</Link>
                    </>
                )}
            </div>
        </nav>
    )
}
