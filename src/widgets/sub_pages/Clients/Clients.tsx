import classes from "./Clients.module.scss";
import {Input} from "shared/index";
import search from "shared/images/sideBarImgs/search.svg";
import filters from "shared/images/filters.svg";
import {useEffect, useState, useMemo, useDeferredValue} from "react";
import {getClients} from "shared/store/slices/clientsSlice";
import {useAppDispatch} from "shared/hooks/useAppDispatch";
import {useAppSelector} from "shared/hooks/useAppSelector";
import ClientCard from "./components/ClientCard";
import FiltersSidebar from "./components/FiltersSidebar";

const Clients = () => {
    const dispatch = useAppDispatch();

    const [searchTerm, setSearchTerm] = useState("");
    const deferredSearch = useDeferredValue(searchTerm);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const handleCheckboxChange = (value: string) => {
        setSelectedFilters((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const {
        list: clients,
    } = useAppSelector((state: any) => state.clients);

    const handleResetFilters = () => {
        setSelectedFilters([]);
    };

    useEffect(() => {
        dispatch(getClients());
    }, [dispatch]);

    const filteredClients = useMemo(
        () =>
            clients.filter((client: any) =>
                client.custom_user.full_name
                    .toLowerCase()
                    .includes(deferredSearch.toLowerCase())
            ),
        [clients, deferredSearch]
    );

    return (
        <div className={classes.wrapper}>
            <main
                className={`${classes.main} ${isSidebarOpen ? classes.shifted : ""}`}
            >
                <form className={classes.form}>
                    <div className={classes.search_and_filter}>
                        <div className={classes.input_wrapper}>
                            <Input
                                className={classes.input}
                                type="text"
                                placeholder="Поиск клиента"
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setSearchTerm(e.target.value)
                                }
                            />
                            <img
                                src={search}
                                alt="Search Icon"
                                className={classes.search_icon}
                            />
                        </div>
                    </div>

                    <div
                        className={classes.filters}
                        onClick={() => setIsSidebarOpen((prev) => !prev)}
                    >
                        <img src={filters} alt=""/>
                        <p>Последнее взаимодействие возрастание</p>
                    </div>
                </form>

                <div className={classes.sum_clients}>
                    <p> Найдено {filteredClients.length} клиента :</p>
                </div>
                {filteredClients.map((client: any) => (
                    <ClientCard key={client.id} client={client}/>
                ))}
            </main>

            <FiltersSidebar
                isOpen={isSidebarOpen}
                isMoreOpen={isMoreOpen}
                selectedFilters={selectedFilters}
                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                onToggleMore={() => setIsMoreOpen((prev) => !prev)}
                onCheckboxChange={handleCheckboxChange}
                onResetFilters={handleResetFilters}
            />
        </div>
    );
};

export default Clients;
