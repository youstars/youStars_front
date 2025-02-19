import React, { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, Filter, Check } from 'lucide-react';
import styles from './Table.module.scss';

function Table() {
  const [selectedTags, setSelectedTags] = useState<string[]>(['Дизайнер', 'Без опыта', 'Junior', 'Middle']);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string>('rating');
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  const specialists = [
    {
      name: 'Алексей Дмитриевич Цой',
      role: 'Middle-Дизайнер',
      rating: 4.9,
      reviews: 75,
      description: 'Молодой дизайнер с большим количеством идеей и энтузиазмом, который трансформирует ваши мечты в реальность. Обладаю обширными навыками работы с стилем, материалами и умением находить интерес в простых вещах.',
      skills: ['Логотипы', 'Брендинг', 'Айдентика', 'Анимация', 'Photoshop', 'After Effects', 'Adobe Illustrator'],
      registrationDate: '01.02.2023',
      activeProjects: 1,
      activeTasks: 3,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      name: 'Ксения Ершова',
      role: 'Дизайнер',
      rating: 4.6,
      reviews: 22,
      description: 'Молодой дизайнер с большим количеством идеей и энтузиазмом, который трансформирует ваши мечты в реальность. Обладаю обширными навыками работы с стилем, материалами и умением находить интерес в простых вещах.',
      skills: ['Брендинг', 'Айдентика', 'Анимация', 'Photoshop', 'Adobe Illustrator', 'After Effects', 'Figma'],
      registrationDate: '01.02.2023',
      activeProjects: 1,
      activeTasks: 3,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  ];

  const sortOptions = [
    { id: 'rating', label: 'По рейтингу' },
    { id: 'reviews', label: 'По отзывам' },
    { id: 'date', label: 'По дате регистрации' },
    { id: 'projects', label: 'По количеству проектов' }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortButtonRef.current && !sortButtonRef.current.contains(event.target as Node)) {
        setIsSortMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSortMenu = () => {
    setIsSortMenuOpen(!isSortMenuOpen);
  };

  const handleSortSelect = (sortId: string) => {
    setSelectedSort(sortId);
    setIsSortMenuOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        {/* Search and Filter Header */}
        <div className={styles.searchHeader}>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Поиск специалиста"
              className={styles.searchInput}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button
              ref={sortButtonRef}
              className={`${styles.sortButton} ${isSortMenuOpen ? styles.active : ''}`}
              onClick={toggleSortMenu}
            >
              <SlidersHorizontal size={20} />
              Сортировка
            </button>
            {isSortMenuOpen && (
              <div className={styles.sortMenu}>
                {sortOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`${styles.sortOption} ${selectedSort === option.id ? styles.active : ''}`}
                    onClick={() => handleSortSelect(option.id)}
                  >
                    <span className={styles.checkmark}>
                      <Check size={16} />
                    </span>
                    {option.label}
                  </div>
                ))}
              </div>
            )}
        
          </div>
        </div>

        {/* Tags */}
        <div className={styles.tagList}>
          {selectedTags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        {/* Results Count */}
        <h2 className={styles.resultsTitle}>
          Найдено 32 специалиста:
        </h2>

        {/* Specialists List */}
        <div className={styles.specialistList}>
          {specialists.map((specialist, index) => (
            <div key={index} className={styles.specialistCard}>
              <div className={styles.cardContent}>
                <img
                  src={specialist.image}
                  alt={specialist.name}
                  className={styles.profileImage}
                />
                <div className={styles.cardInfo}>
                  <div className={styles.cardHeader}>
                    <div className={styles.userInfo}>
                      <h3 className={styles.name}>{specialist.name}</h3>
                      <p className={styles.role}>{specialist.role}</p>
                    </div>
                    <div className={styles.actionGroup}>
                      <div className={styles.rating}>
                        <span className={styles.star}>★</span>
                        <span>{specialist.rating}</span>
                        <span className={styles.reviews}>({specialist.reviews})</span>
                      </div>
                      <div className={styles.buttons}>
                        <button className={styles.iconButton}>
                          ♡
                        </button>
                        <button className={styles.iconButton}>
                          ↗
                        </button>
                        <button className={styles.profileButton}>
                          Профиль
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <p className={styles.description}>
                    {specialist.description}
                  </p>

                  <div className={styles.skillList}>
                    {specialist.skills.map((skill) => (
                      <span key={skill} className={styles.skill}>
                        {skill}
                      </span>
                    ))}
                    {specialist.skills.length > 6 && (
                      <span className={`${styles.skill} ${styles.more}`}>
                        +{specialist.skills.length - 6}
                      </span>
                    )}
                  </div>

                  <div className={styles.metadata}>
                    <span>Дата регистрации: {specialist.registrationDate}</span>
                    <span>Проекты в процессе: {specialist.activeProjects}</span>
                    <span>Задачи в процессе: {specialist.activeTasks}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Panel */}
      <div className={styles.filterPanel}>
        <div className={styles.filterTitle}>
          <Filter className={styles.filterIcon} />
          Фильтр
        </div>

        {/* Profession Section */}
        <div className={styles.filterSection}>
          <h3 className={styles.sectionTitle}>Профессия</h3>
          <div className={styles.checkboxGroup}>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="design" checked />
              <label htmlFor="design">Дизайн</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="graphicDesign" />
              <label htmlFor="graphicDesign">Графический дизайн</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="uxui" />
              <label htmlFor="uxui">UX / UI</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="animation" />
              <label htmlFor="animation">2D / 3D Анимация</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="other" />
              <label htmlFor="other">Другое</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="programming" />
              <label htmlFor="programming">Программирование</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="hr" />
              <label htmlFor="hr">HR</label>
            </div>
          </div>
        </div>

        {/* Salary Range Section */}
        <div className={styles.salaryRange}>
          <h3 className={styles.sectionTitle}>Ожидание по зарплате</h3>
          <div className={styles.rangeInputs}>
            <input type="text" className={styles.rangeInput} placeholder="От" />
            <span className={styles.currencySymbol}>₽</span>
            <input type="text" className={styles.rangeInput} placeholder="До" />
            <span className={styles.currencySymbol}>₽</span>
          </div>
          <div className={styles.rangeSlider}>
            <div className={styles.sliderHandle}></div>
            <div className={styles.sliderHandle}></div>
          </div>
        </div>

        {/* Experience Section */}
        <div className={styles.filterSection}>
          <h3 className={styles.sectionTitle}>Образование и опыт</h3>
          <div className={styles.checkboxGroup}>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="noExperience" checked />
              <label htmlFor="noExperience">Без опыта</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="junior" checked />
              <label htmlFor="junior">Junior</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="senior" />
              <label htmlFor="senior">Senior</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="middle" />
              <label htmlFor="middle">Middle</label>
            </div>
            <div className={styles.checkboxItem}>
              <input type="checkbox" id="top" />
              <label htmlFor="top">Top</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;