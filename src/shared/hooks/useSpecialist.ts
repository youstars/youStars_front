import { useEffect, useCallback, useMemo } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import {
    getSpecialistById,
    updateSpecialist,
    selectSpecialist,
} from "shared/store/slices/specialistSlice";
import { uploadSpecialistFile, deleteFileById } from "shared/api/files";
import type { Specialist } from "shared/types/specialist";

/* ────────────────────────────────────────────────────────── */
/* Нормализуем объект: приводим nullable-поля и маг-строки   */
/* к адекватным типам, группируем вложенные связи и т. д.    */
/* ────────────────────────────────────────────────────────── */
const normalizeSpecialist = (raw: Specialist): Specialist => ({
    ...raw,
    is_busy: raw.is_busy ?? "Not available",
    overall_rating: Number(raw.overall_rating) || 0,
    projects: raw.projects ?? [],
    work_experiences: raw.work_experiences ?? [],
    file: raw.file ?? [],
});

/* ────────────────────────────────────────────────────────── */
/* Главный хук                                              */
/* ────────────────────────────────────────────────────────── */
export const useSpecialist = (id: number | string) => {
    const dispatch = useAppDispatch();

    /** Текущий специалист */
    const specialistEntity = useAppSelector(selectSpecialist);

    /** Глобальный статус получения/обновления и ошибка слайса */
    const { status, error } = useAppSelector((state: any) => state.specialist); // ← поменяйте `specialist` на актуальное название редьюсера, если оно другое

    /** Автолончер: если объекта ещё нет, грузим его */
    useEffect(() => {
        if (!specialistEntity && status !== "loading") {
            dispatch(getSpecialistById(Number(id)));
        }
    }, [dispatch, id, specialistEntity, status]);

    /** Normalized specialist (мемо) */
    const specialist = useMemo(
        () =>
            specialistEntity
                ? normalizeSpecialist(specialistEntity as unknown as Specialist)
                : null,
        [specialistEntity]
    );

    /** Сохранение любых полей специалиста */
    const save = useCallback(
        async (payload: Partial<Specialist>) => {
            if (!id) throw new Error("No specialist id");
            await dispatch(updateSpecialist({ id, ...payload })).unwrap();
        },
        [dispatch, id]
    );

    /** Загрузка файла с авто-рефрешем */
    const uploadFile = useCallback(
        async (file: File, description = "") => {
            await uploadSpecialistFile(file, file.name, Number(id), description);
            dispatch(getSpecialistById(Number(id))); // refresh
        },
        [dispatch, id]
    );

    /** Удаление файла с авто-рефрешем */
    const deleteFile = useCallback(
        async (fileId: number) => {
            await deleteFileById("specialist", fileId);
            dispatch(getSpecialistById(Number(id)));
        },
        [dispatch, id]
    );

    return {
        specialist,
        isLoading: status === "loading",
        error,
        save,
        uploadFile,
        deleteFile,
        /** Пригодится далее, если понадобится ручной рефреш */
        refetch: () => dispatch(getSpecialistById(Number(id))),
    };
};