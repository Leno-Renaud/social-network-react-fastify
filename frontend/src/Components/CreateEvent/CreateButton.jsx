
import React, { useState } from 'react';
import styles from "./CreateEvent.module.scss"
import CreateEvent from './CreateEvent';

export default function CreateButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      {/* Bouton avec rotation intégrée */}
      <button 
        className={`${styles.toggleBtn} ${isOpen ? styles.active : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        +
      </button>

      {/* Conteneur qui glisse */}
      <div className={`${styles.formCollapse} ${isOpen ? styles.show : ''}`}>
        <CreateEvent />
      </div>
    </div>
  );
}