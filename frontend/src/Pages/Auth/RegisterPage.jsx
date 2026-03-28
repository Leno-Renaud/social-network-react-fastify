import Register from '../../Components/Register/Register';
import styles from './AuthPage.module.scss';

export default function RegisterPage() {
  return (
    <main className={styles.authPage}>
      <Register />
    </main>
  );
}
