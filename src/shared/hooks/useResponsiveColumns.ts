import { useEffect, useState } from "react";

/**
 * Хук рассчитывает, сколько колонок помещается в текущий viewport
 * исходя из минимальной ширины одной колонки.
 *
 * @param totalColumns   общее количество возможных колонок
 * @param columnWidthPx  минимальная ширина колонки (по умолчанию 300 px)
 */
export function useResponsiveColumns(
    totalColumns: number,
    columnWidthPx = 300
): number {
    const [count, setCount] = useState(() => {
        if (typeof window === "undefined") return 1;
        return Math.min(
            totalColumns,
            Math.max(1, Math.floor(window.innerWidth / columnWidthPx))
        );
    });

    useEffect(() => {
        const updateCount = () => {
            const next = Math.min(
                totalColumns,
                Math.max(1, Math.floor(window.innerWidth / columnWidthPx))
            );
            setCount(next);
        };
        updateCount();                    // первичный расчёт
        window.addEventListener("resize", updateCount);
        return () => window.removeEventListener("resize", updateCount);
    }, [totalColumns, columnWidthPx]);

    return count;
}