import React from "react";
import styles from "../../ClientProfile.module.scss"; // используем общий SCSS-модуль

export interface BusinessStatsProps {
    edit: boolean;
    form: {
        geography: string;
        employee_count: string;
        revenue: string;
        years_on_market: string;
    };
    onChange: (
        field: "geography" | "employee_count" | "revenue" | "years_on_market"
    ) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    client: {
        geography?: string;
        employee_count?: string;
        revenue?: string;
        years_on_market?: string;
    };
    options: {
        employee: string[];
        revenue: string[];
        years: string[];
    };
}

/**
 * Блок «Бизнес-статистика»: география, сотрудники, выручка, годы на рынке.
 * Работает в режиме просмотра и редактирования.
 */
const BusinessStats: React.FC<BusinessStatsProps> = React.memo(
    ({ edit, form, onChange, client, options }) => (
        <div className={styles.businessStatistics}>
            {/* география */}
            <div className={styles.businessStatBlock}>
                <h4 className={styles.businessTitle}>География</h4>
                {edit ? (
                    <input
                        className={styles.inputFieldBottom}
                        value={form.geography}
                        onChange={onChange("geography")}
                        placeholder="География"
                    />
                ) : (
                    <p className={styles.businessStatValue}>
                        {client.geography || "Не указано"}
                    </p>
                )}
            </div>

            {/* сотрудники */}
            <div className={styles.businessStatBlock}>
                <h4 className={styles.businessTitle}>Количество сотрудников</h4>
                {edit ? (
                    <select
                        className={styles.inputFieldBottom}
                        value={form.employee_count}
                        onChange={onChange("employee_count")}
                    >
                        {options.employee.map((o) => (
                            <option key={o}>{o}</option>
                        ))}
                    </select>
                ) : (
                    <p className={styles.businessStatValue}>
                        {client.employee_count || "Не указано"}
                    </p>
                )}
            </div>

            {/* выручка */}
            <div className={styles.businessStatBlock}>
                <h4 className={styles.businessTitle}>Годовая выручка</h4>
                {edit ? (
                    <select
                        className={styles.inputFieldBottom}
                        value={form.revenue}
                        onChange={onChange("revenue")}
                    >
                        {options.revenue.map((o) => (
                            <option key={o}>{o}</option>
                        ))}
                    </select>
                ) : (
                    <p className={styles.businessStatValue}>
                        {client.revenue || "Не указано"}
                    </p>
                )}
            </div>

            {/* лет на рынке */}
            <div className={styles.businessStatBlock}>
                <h4 className={styles.businessTitle}>Лет на рынке</h4>
                {edit ? (
                    <select
                        className={styles.inputFieldBottom}
                        value={form.years_on_market}
                        onChange={onChange("years_on_market")}
                    >
                        {options.years.map((o) => (
                            <option key={o}>{o}</option>
                        ))}
                    </select>
                ) : (
                    <p className={styles.businessStatValue}>
                        {client.years_on_market || "Не указано"}
                    </p>
                )}
            </div>
        </div>
    )
);

BusinessStats.displayName = "BusinessStats";
export default BusinessStats;