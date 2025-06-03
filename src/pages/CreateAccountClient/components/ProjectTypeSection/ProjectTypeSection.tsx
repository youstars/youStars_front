import React from 'react';
import styles from './ProjectTypeSection.module.scss';

interface Props {
  onNext: () => void;
  onSelect: (value: string) => void;
}

const options = [
  'Новая идея или проект',
  'Существующий проект, которому нужны дополнительные ресурсы',
];

const ProjectTypeSection: React.FC<Props> = ({ onNext, onSelect }) => {
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

export default ProjectTypeSection;
