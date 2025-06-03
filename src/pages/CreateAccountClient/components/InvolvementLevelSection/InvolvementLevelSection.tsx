import React from 'react';
import styles from './InvolvementLevelSection.module.scss';

interface Props {
  onNext: () => void;
  onSelect: (value: string) => void;
}

const options = [
  'Полная занятость (40 часов или более в неделю)',
  'Частичная занятость (менее 40 часов в неделю)',
  'Почасовая оплата',
  'Я решу позже',
];

const InvolvementLevelSection: React.FC<Props> = ({ onNext, onSelect }) => {
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

export default InvolvementLevelSection;
