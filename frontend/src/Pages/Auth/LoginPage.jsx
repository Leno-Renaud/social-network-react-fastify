import Login from '../../Components/Login/Login';
import styles from './AuthPage.module.scss';

export default function LoginPage() {
  return (
    <main className={styles.authPage}>
      <Login />
    </main>
  );
}
