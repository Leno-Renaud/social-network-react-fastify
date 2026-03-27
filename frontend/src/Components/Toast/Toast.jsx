import { useEffect } from 'react';
import styles from './Toast.module.scss';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.icon}>
        {type === 'success' ? '✓' : '✕'}
      </span>
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={onClose}>✕</button>
    </div>
  );
}
