import React, { useState } from 'react';
import styles from './SpecialistSelection.module.scss';
import searchIcon from 'shared/assets/registrationIcons/search.svg';


interface Props {
  onNext: () => void;
  onSelect: (value: string[]) => void;
}

const popularSpecialists = [
  'Бизнес-аналитик',
  'Продуктовый аналитик',
  'Аудитор',
  'Финансовый контролер',
  'Маркетинговый стратег',
  'Бренд-менеджер',
  'Веб-дизайнер',
  'UI-дизайнер',
  'Продакт-менеджер',
  'Проджект-менеджер',
  'Frontend-разработчик',
];

const SpecialistSelection: React.FC<Props> = ({ onNext, onSelect }) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSpecialist = (title: string) => {
    setSelected(prev =>
      prev.includes(title) ? prev.filter(s => s !== title) : [...prev, title]
    );
  };

  const handleContinue = () => {
    onSelect(selected);
    onNext();
  };

  return (
    <div>
      <div className={styles.search}>
        
        <input
          type="text"
          placeholder="Выберите столько, сколько хотите, или сколько вам нужно"
        />
        <button className={styles.searchBtn}> <img src={searchIcon} alt="Search" /></button>
      </div>

      <p className={styles.subtitle}>Популярные профессии</p>

      <div className={styles.tags}>
        {popularSpecialists.map((title) => (
          <button
            key={title}
            className={`${styles.tag} ${selected.includes(title) ? styles.selected : ''}`}
            onClick={() => toggleSpecialist(title)}
          >
            {selected.includes(title) ? '✓ ' : '+ '}
            {title}
          </button>
        ))}
      </div>

      <div className={styles.buttons}>
        <button className={styles.continue} onClick={handleContinue}>
          Продолжить
        </button>
        <button className={styles.skip} onClick={onNext}>
          Пропустить
        </button>
      </div>
    </div>
  );
};

export default SpecialistSelection;
