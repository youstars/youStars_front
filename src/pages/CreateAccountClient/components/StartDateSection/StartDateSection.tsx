import React from 'react';
import styles from './StartDateSection.module.scss';

interface Props {
  onNext: () => void;
  onSelect: (value: string) => void;
}

const options = [
  'Немедленно',
  'Через 1–2 недели',
  'Более чем через 2 недели',
  'Я приму решение позже',
];

const StartDateSection: React.FC<Props> = ({ onNext, onSelect }) => {
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

export default StartDateSection;
