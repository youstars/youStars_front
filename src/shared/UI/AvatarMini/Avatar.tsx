import React from "react";
import classes from "./Avatar.module.scss";
import { getInitials } from "shared/helpers/userUtils";

export interface AvatarProps {

    avatar?: string | null;
    fullName?: string | null;
    size?: "xs" | "sm" | "md" | "lg";
    className?: string;
}

/**
 * Универсальный компонент аватара:
 * ─ показывает изображение, если оно есть;
 * ─ в противном случае — инициалы пользователя;
 * ─ поддерживает несколько размеров и «сквозную» передачу className.
 */
const Avatar: React.FC<AvatarProps> = ({
                                           avatar,
                                           fullName,
                                           size = "md",
                                           className,
                                       }) => {
    const composedClassName = [classes.avatar, classes[size], className]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={composedClassName}>
            {avatar ? (
                <img src={avatar} alt={fullName || "avatar"} />
            ) : (
                <span className={classes.initials}>{getInitials(fullName)}</span>
            )}
        </div>
    );
};

export default React.memo(Avatar);