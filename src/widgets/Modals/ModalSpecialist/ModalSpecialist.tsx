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
    const [selectedSet, setSelectedSet] = useState<Set<string>>(new Set());
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
      () => Array.from(selectedSet),
      [selectedSet]
    );
    const filteredProjects = useMemo(
      () =>
        projects.filter(proj =>
          proj.specialists.some(s => selectedCaptains.includes(s.full_name))
        ),
      [projects, selectedCaptains]
    );


    useEffect(() => {
      setSelectedSet(new Set());
    }, [captains]);

    const handleSelectAll = useCallback(() => {
      setSelectedSet(new Set(filteredCaptains));
    }, [filteredCaptains]);

    const handleReset = useCallback(() => {
      setSelectedSet(new Set());
    }, []);

    const handleCheckboxChange = useCallback((name: string) => {
      setSelectedSet(prev => {
        const next = new Set(prev);
        if (next.has(name)) next.delete(name);
        else next.add(name);
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
                    {filteredCaptains.map((captain) => (
                        <label
                          key={captain}
                          className={`${classes.checkbox} ${selectedSet.has(captain) ? classes.checkboxSelected : ""}`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedSet.has(captain)}
                                onChange={() => handleCheckboxChange(captain)}
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
