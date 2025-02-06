import { useState, useRef, useEffect } from "react";
import classes from "./StatusModal.module.scss";
import { Button } from "shared/index";

interface ModalsProjectsProps {
    onClose: () => void;
}

const statusTitles: { [key: number]: string } = {
    0: "Нужно выполнить",
    1: "В процессе",
    2: "Выполнено",
    3: "Провалено",
};

const StatusModal: React.FC<ModalsProjectsProps> = ({ onClose }) => {
    const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleCheckboxChange = (status: number) => {
        setSelectedStatuses((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        );
    };

    const handleSelectAll = () => {
        setSelectedStatuses(Object.keys(statusTitles).map(Number));
    };

    const handleReset = () => {
        setSelectedStatuses([]);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.modalContent} ref={modalRef}>
                <div className={classes.topButtons}>
                    <Button onClick={handleSelectAll}>Выбрать все</Button>
                    <Button onClick={handleReset}>Сбросить</Button>
                </div>

                <div className={classes.checkboxGroup}>
                    {Object.entries(statusTitles).map(([key, title]) => (
                        <label key={key} className={classes.checkbox}>
                            <input
                                type="checkbox"
                                checked={selectedStatuses.includes(Number(key))}
                                onChange={() => handleCheckboxChange(Number(key))}
                            />
                            <span>{title}</span>
                        </label>
                    ))}
                </div>

                <div className={classes.divider} />
                <div className={classes.bottomButtons}>
                    <Button onClick={onClose}>Отмена</Button>
                    <Button onClick={onClose}>ОК</Button>
                </div>
            </div>
        </div>
    );
};

export default StatusModal;
