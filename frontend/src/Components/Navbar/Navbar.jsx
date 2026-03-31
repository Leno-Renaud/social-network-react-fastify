import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.scss'

import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContextObject';
import CreateButton from '../CreateButton/CreateButton';

export default function Navbar(){
    const { user, logoutUser } = useContext(AuthContext)
    const navigate = useNavigate()

    function logout(){
        logoutUser()
        navigate("/login")
    }
    return(
        <nav className={styles.navbar}>
            {user && (
                <>
                    <div className={styles.mainLinks}>
                        <Link to="/" className={styles.navLink}>Home</Link>
                        <Link to="/events" className={`${styles.navLink} ${styles.mobileHidden}`}>Events</Link>
                        <Link to="/matching" className={`${styles.navLink} ${styles.mobileHidden}`}>Matching</Link>
                        <Link to="/chat" className={`${styles.navLink} ${styles.mobileHidden}`}>Chat</Link>
                    </div>
                    <div className={styles.centerAction}>
                        <CreateButton />
                    </div>
                </>
            )
            }
            <div className={styles.authLinks}>
            {user ? (
                <div className={styles.authGroup}>
                    <Link to="/profile">{user.username}</Link>
                    <button onClick={() => {logout()}}>Logout</button>
                </div>
            ) : (
                <>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
                </>
            )}
            </div>
        </nav>
    )
}