import React, { useState } from 'react';
import styles from "./CreateButton.module.scss";
import CreateEvent from '../CreateEvent/CreateEvent';
import CreateVoyage from '../CreateVoyage/CreateVoyage';

export default function CreateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('choice'); // 'choice', 'event', ou 'voyage'
  const [formKey, setFormKey] = useState(0);

  const toggleMenu = () => {
    if (isOpen) {
      // Reset complet quand on ferme (on revient au choix et on nettoie les inputs)
      setTimeout(() => setView('choice'), 300); 
      setFormKey(prev => prev + 1);
    }
    setIsOpen(!isOpen);
  };

  const handleCreateSuccess = () => {
    setIsOpen(false);
    setTimeout(() => setView('choice'), 300);
  };

  return (
    <div className={styles.navActionWrapper}>
      <button 
        className={`${styles.toggleBtn} ${isOpen ? styles.active : ''}`}
        onClick={toggleMenu}
      >
        +
      </button>

      <div className={`${styles.menuOverlay} ${isOpen ? styles.show : ''}`} onClick={toggleMenu}>
        <div className={styles.menuDropdown} onClick={(e) => e.stopPropagation()}>
          <div className={styles.scrollContainer}>
            
            {/* ETAPE 1 : Le menu de sélection */}
            {view === 'choice' && (
              <div className={styles.choiceContainer}>
                <h2>Que souhaitez-vous créer ?</h2>
                <div className={styles.buttonGrid}>
                  <button className={styles.bigBtn} onClick={() => setView('event')}>
                    <span className={styles.icon}>📅</span>
                    <span className={styles.label}>Évènement</span>
                    <p>Une soirée, un sport, un rdv...</p>
                  </button>
                  <button className={styles.bigBtn} onClick={() => setView('voyage')}>
                    <span className={styles.icon}>✈️</span>
                    <span className={styles.label}>Voyage</span>
                    <p>Un week-end, des vacances...</p>
                  </button>
                </div>
              </div>
            )}

            {/* ETAPE 2 : Le formulaire choisi */}
            {view === 'event' && (
              <div className={styles.formView}>
                <button className={styles.backLink} onClick={() => setView('choice')}>← Retour au choix</button>
                <CreateEvent key={`evt-${formKey}`} onCreate={handleCreateSuccess} />
              </div>
            )}

            {view === 'voyage' && (
              <div className={styles.formView}>
                <button className={styles.backLink} onClick={() => setView('choice')}>← Retour au choix</button>
                <CreateVoyage key={`voy-${formKey}`} onCreate={handleCreateSuccess} />
              </div>
            )}

          </div>
        </div>
      </div>
      
      {isOpen && <div className={styles.backdrop} />}
    </div>
  );
}