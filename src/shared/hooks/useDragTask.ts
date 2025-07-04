import { AppDispatch } from "shared/store";
import {
    optimisticUpdateTaskStatus,
    updateTaskFields,
} from "shared/store/slices/tasksSlice";
import { Task, TaskStatus } from "shared/types/tasks";

interface Params {
    tasks: Task[];
    dispatch: AppDispatch;
    setHoveredStatus: (s: TaskStatus | null) => void;
}

/**
 * Универсальные обработчики drag-n-drop для Kanban-задач.
 */
export function useDragTask({ tasks, dispatch, setHoveredStatus }: Params) {
    const handleDragOver =
        (status: TaskStatus) => (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            setHoveredStatus(status);
        };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setHoveredStatus(null);
        }
    };

    const handleDrop =
        (newStatus: TaskStatus) => async (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setHoveredStatus(null);

            const taskId = Number(e.dataTransfer.getData("task-id"));
            if (!taskId) return;

            const task = tasks.find((t) => t.id === taskId);
            if (!task || task.status === newStatus) return;

            // optimistic UI
            dispatch(optimisticUpdateTaskStatus({ id: taskId, status: newStatus }));
            try {
                await dispatch(
                    updateTaskFields({ id: taskId, changes: { status: newStatus } })
                ).unwrap();
            } catch (err) {
                console.error("Ошибка при смене статуса:", err);
            }
        };

    return { handleDragOver, handleDragLeave, handleDrop };
}