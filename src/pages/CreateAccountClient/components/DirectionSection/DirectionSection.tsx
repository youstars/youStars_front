import React from 'react';
import styles from './DirectionSection.module.scss';

import BriefcaseIcon from 'shared/assets/registrationIcons/Briefcase.svg';
import FinanceIcon from 'shared/assets/registrationIcons/Finance icon.svg';
import MegaphoneIcon from 'shared/assets/registrationIcons/Mgaphone.svg';
import PalletteIcon from 'shared/assets/registrationIcons/Pallette.svg';
import SVGIcon from 'shared/assets/registrationIcons/SVG.svg';
import VectorIcon from 'shared/assets/registrationIcons/Vector.svg';

interface Props {
  onNext: () => void;
  onSelect: (value: string) => void;
}

const directions = [
  {
    title: 'Разработка',
    desc: 'Backend-разработка, Frontend-разработка, Мобильная разработка, QA, DevOps...',
    icon: BriefcaseIcon,
  },
  {
    title: 'Аналитика',
    desc: 'Проведение A/B-тестов и анализ результатов...',
    icon: SVGIcon,
  },
  {
    title: 'Финансы',
    desc: 'Разработка финансовых и инвестиционных моделей...',
    icon: FinanceIcon,
  },
  {
    title: 'Дизайн',
    desc: 'UI/UX-дизайн, графика, брендинг...',
    icon: PalletteIcon,
  },
  {
    title: 'Менеджмент',
    desc: 'Продакт- и проект-менеджмент, операционка...',
    icon: VectorIcon,
  },
  {
    title: 'Маркетинг',
    desc: 'SEO, реклама, контент и SMM...',
    icon: MegaphoneIcon,
  },
];

const DirectionSection: React.FC<Props> = ({ onNext, onSelect }) => {
  return (
    <div className={styles.list}>
      {directions.map((dir, index) => (
        <div
          className={styles.item}
          key={index}
          onClick={() => {
            onSelect(dir.title); 
            onNext();
          }}
        >
          <div className={styles.icon}>
            <img src={dir.icon} alt={dir.title} />
          </div>
          <div className={styles.content}>
            <h3>{dir.title}</h3>
            <p>{dir.desc}</p>
          </div>
          <span className={styles.arrow}>→</span>
        </div>
      ))}
    </div>
  );
};

export default DirectionSection;
