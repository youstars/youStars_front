import React from 'react';
import styles from './DeveloperDurationSection.module.scss';

interface Props {
  onNext: () => void;
  onSelect: (value: string) => void;
}

const options = [
  'Менее 1 недели',
  'От 1 до 4 недель',
  'От 1 до 3 месяцев',
  'От 3 до 6 месяцев',
  'Дольше 6 месяцев',
  'Я решу позже',
];

const DeveloperDurationSection: React.FC<Props> = ({ onNext, onSelect }) => {
  const handleClick = (value: string) => {
    onSelect(value);
    onNext();
  };

  return (
    <div className={styles.list}>
      {options.map((label, index) => (
        <div key={index} className={styles.item} onClick={() => handleClick(label)}>
          <span>{label}</span>
          <span className={styles.arrow}>→</span>
        </div>
      ))}
    </div>
  );
};

export default DeveloperDurationSection;
