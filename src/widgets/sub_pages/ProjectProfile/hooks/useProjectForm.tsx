import {useState, useCallback, useMemo} from "react";
import {ProjectDetail} from "shared/types/project";

export const useProjectForm = (initial?: ProjectDetail) => {
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(() => mapProjectToForm(initial));

    /* ---------- helpers ---------- */
    const dirtyKeys = useMemo(() => {
        if (!initial) return [];
        return Object.entries(form)
            .filter(([key, value]) => value !== (initial as any)[key])
            .map(([key]) => key as keyof typeof form);
    }, [form, initial]);

    const handleChange = useCallback(
        <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
            setForm((prev) => ({...prev, [key]: value}));
        },
        []
    );

    const reset = useCallback(
        (project?: ProjectDetail) => setForm(mapProjectToForm(project)),
        []
    );

    return {isEditing, setIsEditing, form, handleChange, reset, dirtyKeys};
};

const mapProjectToForm = (p?: ProjectDetail) => ({
    name: p?.name ?? "",
    goal: p?.goal ?? "",
    solving_problems: p?.solving_problems ?? "",
    product_or_service: p?.product_or_service ?? "",
    extra_wishes: p?.extra_wishes ?? "",
    start_date: p?.start_date ?? "",
    status: p?.status ?? "in_progress",
    status_start_date: p?.updated_at ?? "",
    budget: p?.budget ?? "",
    deadline: p?.deadline ?? "",
});