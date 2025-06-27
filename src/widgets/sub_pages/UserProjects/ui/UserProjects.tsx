import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "shared/store";
import {getProjects} from "shared/store/slices/projectsSlice";
import classes from "./UserProjects.module.scss";
import {Input} from "shared/index";
import {useUserRole} from "shared/hooks/useUserRole";
import ClientProject from "../components/Client/ClientProject";
import TrackerProject from "../components/Tracker/TrackerProject";
import searchIcon from "shared/images/sideBarImgs/search.svg";

interface CustomUser {
    full_name?: string;
}

interface Specialist {
    id?: number | string;
    custom_user?: CustomUser;
    full_name?: string;
}

interface Client {
    full_name?: string;
}

interface Tracker {
    full_name?: string;
}

export interface LeanProject {
    id: number | string;
    name?: string;
    deadline?: string;
    tracker?: Tracker;
    specialists?: Specialist[];
    students?: Specialist[];
    client?: Client;
}

export default function UserProjects() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const dispatch = useDispatch<AppDispatch>();
    const role = useUserRole();
    const isClient = role?.toLowerCase().includes("client");
    const projects = useSelector((s: any) => s.projects.projects) as LeanProject[] | undefined;
    const filteredProjects = useMemo(() => {
        if (!projects) return [];
        const q = searchTerm.toLowerCase();
        return projects.filter((p: any) =>
            (p.name ?? "").toLowerCase().includes(q),
        );
    }, [projects, searchTerm]);

    useEffect(() => {
        dispatch(getProjects()).catch(console.error);
    }, [dispatch]);
    const SearchBar = (
        <div className={classes.search_and_filter}>
            <div className={classes.search}>
                <div className={classes.input_wrapper}>
                    <Input
                        className={classes.input}
                        type="text"
                        placeholder="Поиск"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchTerm(e.target.value)
                        }
                    />
                    <img src={searchIcon} alt="search" className={classes.search_icon}/>
                </div>
            </div>
            {!isClient && (
                <div className={classes.filter}>
                    <p>Сбросить фильтры</p>
                    <p>Сохранить комбинацию</p>
                </div>
            )}
        </div>
    );
    // ─────────────────────────────────── client view
    const renderClientView = () => (
        <div className={classes.context}>
            {filteredProjects && filteredProjects.length ? (
                filteredProjects.map((project: any) => (
                    <ClientProject key={project.id} project={project}/>
                ))
            ) : (
                <p>
                    {projects ? "Нет данных для отображения" : "Загрузка данных..."}
                </p>
            )}
        </div>
    );

    // ─────────────────────────────────── tracker view
    const renderTrackerView = () => <TrackerProject projects={filteredProjects}/>;

    // ─────────────────────────────────── render
    return (
        <main className={classes.main}>
            {SearchBar}
            {isClient ? renderClientView() : renderTrackerView()}
        </main>
    );
}
