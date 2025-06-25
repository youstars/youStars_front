import React from "react";
import RateItem from "shared/UI/RateItem/RateItem";
import type { SpecialistFormData } from "shared/types/specialist";
import styles from "./RateBlock.module.scss";

interface CustomUser {
    time_zone?: string;
}

interface RateBlockProps {
    isEditMode: boolean;
    formData: SpecialistFormData;
    onFieldChange: (field: keyof SpecialistFormData, value: string) => void;
    customUser: CustomUser;
}

const hourlyRateOptions = [
    "Not defined",
    "From 200 rub",
    "200-300 rub",
    "300-500 rub",
    "500-700 rub",
    "700-1000 rub",
    "1000-1500 rub",
    "1500-3000 rub",
    "More than 3000 rub",
];

const hoursPerWeekOptions = [
    "Not defined",
    "Up to 5 hours",
    "5-10 hours",
    "10-20 hours",
    "20-30 hours",
    "30-40 hours",
    "More than 40 hours",
];

const RateBlock: React.FC<RateBlockProps> = ({
                                                 isEditMode,
                                                 formData,
                                                 onFieldChange,
                                                 customUser,
                                             }) => (
    <div className={styles.rateBlock}>
        <RateItem
            title="Примерная ставка в час"
            value={
                isEditMode ? (
                    <select
                        className={styles.inputField}
                        value={formData.hourlyRate}
                        onChange={(e) => onFieldChange("hourlyRate", e.target.value)}
                    >
                        {hourlyRateOptions.map((o) => (
                            <option key={o}>{o}</option>
                        ))}
                    </select>
                ) : formData.hourlyRate && formData.hourlyRate !== "Not defined" ? (
                    formData.hourlyRate
                ) : (
                    "Не указано"
                )
            }
        />
        <RateItem
            title="Занятость в неделю"
            value={
                isEditMode ? (
                    <select
                        className={styles.inputField}
                        value={formData.hoursPerWeek}
                        onChange={(e) => onFieldChange("hoursPerWeek", e.target.value)}
                    >
                        {hoursPerWeekOptions.map((o) => (
                            <option key={o}>{o}</option>
                        ))}
                    </select>
                ) : formData.hoursPerWeek &&
                formData.hoursPerWeek !== "Not defined" ? (
                    formData.hoursPerWeek
                ) : (
                    "Не указано"
                )
            }
        />
        <RateItem title="Часовой пояс" value={customUser.time_zone || "Не указано"} />
    </div>
);

export default RateBlock;