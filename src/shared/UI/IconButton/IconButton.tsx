// shared/UI/IconButton/IconButton.tsx
import React from "react";
import styles from "./IconButton.module.scss";

interface IconButtonProps {
  icon: string;
  alt: string;
  onClick: () => void;
  title?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, alt, onClick, title }) => {
  return (
    <button className={styles.iconButton} onClick={onClick} title={title}>
      <img src={icon} alt={alt} />
    </button>
  );
};

export default IconButton;
