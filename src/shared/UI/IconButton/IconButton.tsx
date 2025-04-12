import React from "react";
import styles from "./IconButton.module.scss";

interface IconButtonProps {
  icon: string;
  alt: string;
  onClick?: () => void;
  title?: string;
  size?: IconButtonSize;
  borderColor?: string;
}

type IconButtonSize = "sm" | "md" | "lg";

const SIZE_MAP = {
  sm: { button: 28, icon: 10 },
  md: { button: 36, icon: 20 },
  lg: { button: 52, icon: 30 },
};


const IconButton: React.FC<IconButtonProps> = ({
  icon,
  alt,
  onClick,
  title,
  size = "md",
  borderColor = "white",
}) => {
  const { button, icon: iconSize } = SIZE_MAP[size];

  return (
    <button
      className={styles.iconButton}
      onClick={onClick}
      title={title}
      style={{ width: button, height: button, borderColor: borderColor }}
    >
      <img src={icon} alt={alt} style={{ width: iconSize, height: iconSize }} />
    </button>
  );
};

export default IconButton;