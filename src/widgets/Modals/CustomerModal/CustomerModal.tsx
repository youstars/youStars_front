import { useState, useEffect, useRef } from "react";
import classes from "./CustomerModal.module.scss";
import search from "shared/images/sideBarImgs/search.svg";
import { useSelector } from "react-redux";

interface CustomerModalProps {
    onClose: () => void;
    Input: React.ComponentType<any>;
    Button: React.ComponentType<any>;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ onClose, Input, Button }) => {
    const getData = useSelector((state: any) => state.tasks.tasks);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedItems, setSelectedItems] = useState<boolean[]>([]);
    const [filteredClients, setFilteredClients] = useState<{ client: string; coefficient: string }[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (getData?.results) {
            const clients = getData.results.map((item: any) => ({
                client: item.client || "Не указан",
                coefficient: item.intricacy_coefficient ? `Коэф: ${item.intricacy_coefficient}` : "Коэф: Не указан",
            }));
            setFilteredClients(clients);
            setSelectedItems(new Array(clients.length).fill(false));
        }
    }, [getData]);

    useEffect(() => {
        if (getData?.results) {
            const filtered = getData.results
                .map((item: any) => ({
                    client: item.client || "Не указан",
                    coefficient: item.intricacy_coefficient ? `Коэф: ${item.intricacy_coefficient}` : "Коэф: Не указан",
                }))
                .filter((item: any) =>
                    item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.coefficient.toLowerCase().includes(searchTerm.toLowerCase())
                );
            setFilteredClients(filtered);
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
        setSelectedItems(new Array(filteredClients.length).fill(true));
    };

    const handleReset = () => {
        setSelectedItems(new Array(filteredClients.length).fill(false));
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
                    <Button onClick={handleSelectAll}>Выбрать всех</Button>
                    <Button onClick={handleReset}>Сбросить</Button>
                </div>
                <div className={classes.searchImg}>
                    <Input
                        className={classes.inputSearch}
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchTerm(e.target.value)
                        }
                        placeholder="Поиск по заказчикам и коэффициенту"
                    />
                    <img src={search} alt="search"/>
                </div>

                <div className={classes.checkboxGroup}>
                    {filteredClients.map((item, index) => (
                        <label key={index} className={classes.checkbox}>
                            <input
                                type="checkbox"
                                checked={selectedItems[index]}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            <span>{item.coefficient}</span>
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

export default CustomerModal;
