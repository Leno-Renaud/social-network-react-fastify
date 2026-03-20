import React, { useState } from 'react';
import { INSA_STRUCTURE } from '../DptInsa/insaData';
import styles from './MultiSelect.module.scss';

export default function MultiSelect({ selectedDeps, setSelectedDeps }) {
  //const [selected, setSelected] = useState([]);
  const [openInsas, setOpenInsas] = useState([]); // Stocke les IDs des INSA ouverts

  // Fonction pour ouvrir/fermer un INSA
  const toggleAccordion = (insaId) => {
    setOpenInsas(prev => 
      prev.includes(insaId) ? prev.filter(id => id !== insaId) : [...prev, insaId]
    );
  };

  const toggleDep = (depId) => {
    setSelectedDeps(prev => 
      prev.includes(depId) ? prev.filter(id => id !== depId) : [...prev, depId]
    );
  };

  const toggleInsa = (insa) => {
    const insaDeps = insa.deps.map(d => `${insa.id}-${d}`);
    const isAllSelected = insaDeps.every(d => selectedDeps.includes(d));
    if (isAllSelected) {
      setSelectedDeps(selectedDeps.filter(id => !insaDeps.includes(id)));
    } else {
      setSelectedDeps([...new Set([...selectedDeps, ...insaDeps])]);
    }
  };

  return (
    <div className={styles.scrollBox}>
      {INSA_STRUCTURE.map(insa => {
        const isOpen = openInsas.includes(insa.id);
        const insaDeps = insa.deps.map(d => `${insa.id}-${d}`);
        const isParentChecked = insaDeps.every(d => selectedDeps.includes(d));
        const nbSelected = insaDeps.filter(d => selectedDeps.includes(d)).length;

        return (
          <div key={insa.id} className={styles.insaGroup}>
            <div className={styles.insaHeader}>
              {/* Le petit bouton + / - */}
              <button 
                type="button" 
                className={styles.toggleBtn} 
                onClick={() => toggleAccordion(insa.id)}
              >
                {isOpen ? '−' : '+'}
              </button>

              <label className={styles.parentLabel}>
                <input 
                  type="checkbox" 
                  checked={isParentChecked} 
                  onChange={() => toggleInsa(insa)} 
                />
                {insa.name} 
                {nbSelected > 0 && <span className={styles.badge}>{nbSelected}</span>}
              </label>
            </div>
            
            {/* On n'affiche les enfants que si isOpen est true */}
            {isOpen && (
              <div className={styles.childrenOptions}>
                {insa.deps.map(dep => {
                  const depId = `${insa.id}-${dep}`;
                  return (
                    <label key={depId} className={styles.childOption}>
                      <input 
                        type="checkbox" 
                        checked={selectedDeps.includes(depId)} 
                        onChange={() => toggleDep(depId)} 
                      />
                      {dep}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}