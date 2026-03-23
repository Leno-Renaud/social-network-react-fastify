
import React, { useState } from 'react';
import styles from "./CreateEvent.module.scss"
import CreateEvent from './CreateEvent';

export default function CreateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleToggle = () => {
    if (isOpen) {
      // Si on ferme, on incrémente la clé pour "reset" le composant au prochain tour
      setFormKey(prev => prev + 1);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.wrapper}>
      <button 
        className={`${styles.toggleBtn} ${isOpen ? styles.active : ''}`} 
        onClick={handleToggle}
      >
        +
      </button>

      <div className={`${styles.formCollapse} ${isOpen ? styles.show : ''}`}>
        {/* En changeant la key, CreateEvent redémarre à zéro */}
        <CreateEvent key={formKey} onCreate={setIsOpen}/>
      </div>
    </div>
  );
}