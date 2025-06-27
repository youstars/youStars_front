import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "shared/store";
import {getProjects} from "shared/store/slices/projectsSlice";
import classes from "./UserProjects.module.scss";
import {useUserRole} from "shared/hooks/useUserRole";
import ClientProject from "../components/Client/ClientProject";
import TrackerProject from "../components/Tracker/TrackerProject";
import SearchAndFilter from "./SearchAndFilter";

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
    /** ID заявки (может приходить числом либо строкой, иногда как объект с name) */
    order?: number | string | { name?: string };
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
        return projects.filter((p: any) => {
            const projectName: string = p.project?.name ?? p.name ?? "";

            let orderStr = "";
            if (typeof p.order === "number" || typeof p.order === "string") {
                orderStr = String(p.order);
            } else if (p.order && typeof p.order === "object" && "name" in p.order) {
                orderStr = (p.order.name as string) ?? "";
            }
            return (
                projectName.toLowerCase().includes(q) ||
                orderStr.toLowerCase().includes(q)
            );
        });
    }, [projects, searchTerm]);

    useEffect(() => {
        dispatch(getProjects()).catch(console.error);
    }, [dispatch]);

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
            <SearchAndFilter
                value={searchTerm}
                onChange={setSearchTerm}
                isClient={isClient}
            />
            {isClient ? renderClientView() : renderTrackerView()}
        </main>
    );
}
