import {useEffect, useCallback} from "react";
import {useSelector} from "react-redux";
import {
    getProjectById,
    updateProject,
    updateProjectStatus,
    selectCurrentProject,
    selectProjectsError,
    selectProjectsStatus,
} from "shared/store/slices/projectsSlice";
import {useAppDispatch} from "shared/hooks/useAppDispatch";

export interface UseProjectResult {
    project: ReturnType<typeof selectCurrentProject>;
    loading: boolean;
    error: string | null;
    refresh: () => void;
    update: (updates: Partial<ProjectUpdatePayload>) => Promise<void>;
    toggleStatus: () => Promise<void>;
}

export type ProjectUpdatePayload = {
    name: string;
    goal: string;
    solving_problems: string;
    product_or_service: string;
    extra_wishes: string;
    start_date: string;
    status: "in_progress" | "completed";
    status_start_date: string;
    budget: string;
    deadline: string;
};

export const useProject = (id?: string | number): UseProjectResult => {
    const dispatch = useAppDispatch();

    const project = useSelector(selectCurrentProject);
    const error = useSelector(selectProjectsError);
    const status = useSelector(selectProjectsStatus);
    const loading = status === "pending";

    /* ---------- lifecycle ---------- */
    const refresh = useCallback(() => {
        if (id) dispatch(getProjectById(id));
    }, [dispatch, id]);

    useEffect(refresh, [refresh]);

    /* ---------- mutations ---------- */
    const update = useCallback(
        async (updates: Partial<ProjectUpdatePayload>) => {
            if (!project?.id) return;
            await dispatch(updateProject({id: project.id, updates})).unwrap();
        },
        [dispatch, project?.id]
    );

    const toggleStatus = useCallback(async () => {
        if (!project?.id || !project.status) return;
        const newStatus =
            project.status === "in_progress" ? "completed" : "in_progress";
        await dispatch(
            updateProjectStatus({id: project.id, status: newStatus})
        ).unwrap();
    }, [dispatch, project?.id, project?.status]);

    return {project, loading, error, refresh, update, toggleStatus};
};