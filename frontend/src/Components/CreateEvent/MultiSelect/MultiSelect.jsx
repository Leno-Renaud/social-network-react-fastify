import { INSA_STRUCTURE } from '../../../Data/insaData';
import styles from './MultiSelect.module.scss';

export default function MultiSelect({ selectedDeps, setSelectedDeps }) {

  const toggle = (insaId) => {
    setSelectedDeps(prev =>
      prev.includes(insaId) ? prev.filter(id => id !== insaId) : [...prev, insaId]
    );
  };

  const toggleAll = () => {
    const allIds = INSA_STRUCTURE.map(i => i.id);
    const isAllSelected = allIds.every(id => selectedDeps.includes(id));
    setSelectedDeps(isAllSelected ? [] : allIds);
  };

  return (
    <div className={styles.multiSelect}>
      <label className={styles.selectAllLabel}>
        <input
          type="checkbox"
          checked={selectedDeps.length === INSA_STRUCTURE.length}
          onChange={toggleAll}
        />
        Tous les INSA
      </label>
      <div className={styles.insaGrid}>
        {INSA_STRUCTURE.map(insa => (
          <label key={insa.id} className={`${styles.insaOption} ${selectedDeps.includes(insa.id) ? styles.selected : ''}`}>
            <input
              type="checkbox"
              checked={selectedDeps.includes(insa.id)}
              onChange={() => toggle(insa.id)}
            />
            {insa.name}
          </label>
        ))}
      </div>
    </div>
  );
}
