import React from 'react';
import styles from './CompanySizeSection.module.scss';

interface Props {
  onNext: () => void;
  onSelect: (value: string) => void;
}

const sizes = [
  'Меньше 10',
  '11 - 50',
  '51 - 200',
  '201 - 1000',
  '1001 - 5000',
  'Более 5000',
];

const CompanySizeSection: React.FC<Props> = ({ onNext, onSelect }) => {
  const handleClick = (value: string) => {
    onSelect(value);
    onNext();
  };

  return (
    <div className={styles.list}>
      {sizes.map((label, index) => (
        <div key={index} className={styles.item} onClick={() => handleClick(label)}>
          <span>{label}</span>
          <span className={styles.arrow}>→</span>
        </div>
      ))}
    </div>
  );
};

export default CompanySizeSection;
