import { useState, useEffect, useRef } from "react";
import classes from "./ModalsProjects.module.scss";
import search from "shared/images/sideBarImgs/search.svg";
import { useSelector } from "react-redux";

interface ModalsProjectsProps {
    onClose: () => void;
    Input: React.ComponentType<any>;
    Button: React.ComponentType<any>;
}

const ModalsProjects: React.FC<ModalsProjectsProps> = ({ onClose, Input, Button }) => {
    const getData = useSelector((state: any) => state.tasks.tasks);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<boolean[]>([]);
    const [filteredDescriptions, setFilteredDescriptions] = useState<string[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (getData?.results) {
            const names = getData.results.map((item: any) => item.name || "Без названия");
            setFilteredDescriptions(names);
            setSelectedItems(new Array(names.length).fill(false));
        }
    }, [getData]);

    useEffect(() => {
        if (getData?.results) {
            const filtered = getData.results
                .map((item: any) => item.name || "Без названия")
                .filter((name: string) => name.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredDescriptions(filtered);
        }
    }, [searchTerm, getData]);

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

    const handleSelectAll = () => {
        setSelectedItems(new Array(filteredDescriptions.length).fill(true));
    };

    const handleReset = () => {
        setSelectedItems(new Array(filteredDescriptions.length).fill(false));
    };

    const handleCheckboxChange = (index: number) => {
        const newSelectedItems = [...selectedItems];
        newSelectedItems[index] = !newSelectedItems[index];
        setSelectedItems(newSelectedItems);
    };

    return (
        <div className={classes.modalOverlay}>
            <div className={classes.modalContent} ref={modalRef}>
                <div className={classes.topButtons}>
                    <Button onClick={handleSelectAll}>Select All</Button>
                    <Button onClick={handleReset}>Reset</Button>
                </div>
                <div className={classes.searchImg}>
                    <Input
                        className={classes.inputSearch}
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchTerm(e.target.value)
                        }
                        placeholder="Поиск"
                    />
                    <img src={search} alt="search" />
                </div>

                <div className={classes.checkboxGroup}>
                    {filteredDescriptions.map((description, index) => (
                        <label key={index} className={classes.checkbox}>
                            <input
                                type="checkbox"
                                checked={selectedItems[index]}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            {description}
                        </label>
                    ))}
                </div>
                <div className={classes.divider} />
                <div className={classes.bottomButtons}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={() => {
                            onClose();
                        }}
                    >
                        OK
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModalsProjects;
