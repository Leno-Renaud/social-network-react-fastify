import { Link, useNavigate } from 'react-router-dom';
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
    return(
        <nav className={styles.navbar}>
            {user && (
                <>
                <Link to="/">Home</Link>
                <Link to="/events">Events</Link>
                <CreateButton />
                <Link to="/matching">Matching</Link> 
                </>
            )
            }
            <div className={styles.authLinks}>
            {user ? (
                <>
                    <span>{user.username}</span>
                    <button onClick={() => {logout()}}>Logout</button>
                </>
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