import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import classes from "./ModalSpecialist.module.scss";
import search from "shared/images/sideBarImgs/search.svg";

interface ModalSpecialistProps {
    onClose: () => void;
    Input: React.ComponentType<any>;
    Button: React.ComponentType<any>;
    projects: {
      id: string | number;
      name?: string;
      project_name?: string;
      specialists: { id: string | number; full_name: string }[];
    }[];
    onFilter: (filtered: {
      id: string | number;
      name?: string;
      project_name?: string;
      specialists: { id: string | number; full_name: string }[];
    }[]) => void;
}

const ModalSpecialist: React.FC<ModalSpecialistProps> = ({ onClose, Input, Button, projects, onFilter }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<boolean[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);

    const captains = useMemo(() => {
      const allNames = projects.flatMap(proj =>
        proj.specialists.map(s => s.full_name)
      );
      return Array.from(new Set(allNames));
    }, [projects]);
    const filteredCaptains = useMemo(
      () =>
        captains.filter(name =>
          name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      [captains, searchTerm]
    );

    const selectedCaptains = useMemo(
      () => filteredCaptains.filter((_, idx) => selectedItems[idx]),
      [filteredCaptains, selectedItems]
    );
    const filteredProjects = useMemo(
      () =>
        projects.filter(proj =>
          proj.specialists.some(s => selectedCaptains.includes(s.full_name))
        ),
      [projects, selectedCaptains]
    );


    useEffect(() => {
      setSelectedItems(new Array(captains.length).fill(false));
    }, [captains]);

    const handleSelectAll = useCallback(() => {
      setSelectedItems(new Array(filteredCaptains.length).fill(true));
    }, [filteredCaptains.length]);

    const handleReset = useCallback(() => {
      setSelectedItems(new Array(filteredCaptains.length).fill(false));
    }, [filteredCaptains.length]);

    const handleCheckboxChange = useCallback((index: number) => {
      setSelectedItems(prev => {
        const next = [...prev];
        next[index] = !next[index];
        return next;
      });
    }, []);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    }, []);

    const handleClickOutside = useCallback((event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }, [onClose]);

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [handleClickOutside]);

    return (
        <div className={classes.modalOverlay}>
            <div
              className={classes.modalContent}
              ref={modalRef}
              role="dialog"
              aria-modal="true"
            >
                <div className={classes.topButtons}>
                    <Button onClick={handleSelectAll}>Выбрать всех</Button>
                    <Button onClick={handleReset}>Сбросить</Button>
                </div>
                <div className={classes.searchImg}>
                    <Input
                        className={classes.inputSearch}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Поиск по специалистам"
                    />
                    <img src={search} alt="search"/>
                </div>

                <div className={classes.checkboxGroup}>
                    {filteredCaptains.map((captain, index) => (
                        <label
                          key={`${captain}-${index}`}
                          className={`${classes.checkbox} ${selectedItems[index] ? classes.checkboxSelected : ""}`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedItems[index]}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            <span>{captain}</span>
                        </label>
                    ))}
                </div>

                <div className={classes.divider} />
                <div className={classes.bottomButtons}>
                    <Button onClick={onClose}>Отмена</Button>
                    <Button
                      onClick={() => {
                        onFilter(filteredProjects);
                        onClose();
                      }}
                    >
                      ОК
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModalSpecialist;
