import React from "react";
import styles from "../ClientProfile.module.scss"; // используем общий SCSS-модуль

export interface ClientMetricsProps {
    ordersInProgress: number;
    ordersTotal: number;
    orderCostAvg: number;
    mood?: string;
}

/**
 * Отображает ключевые метрики клиента:
 *  – активные заказы
 *  – всего заказов
 *  – среднюю стоимость
 *  – настроение
 */
const ClientMetrics: React.FC<ClientMetricsProps> = React.memo(
    ({ ordersInProgress, ordersTotal, orderCostAvg, mood = "—" }) => (
        <div className={styles.clientMetrics}>
            <p className={styles.clientMetric}>
                Активных заказов: {ordersInProgress ?? 0}
            </p>
            <p className={styles.clientMetric}>
                Всего заказов: {ordersTotal ?? 0}
            </p>
            <p className={styles.clientMetric}>
                Средняя стоимость: {Math.round(orderCostAvg) ?? 0} ₽
            </p>
            <p className={styles.clientMetric}>Настроение: {mood}</p>
        </div>
    )
);

ClientMetrics.displayName = "ClientMetrics";
export default ClientMetrics;