import React from "react";
import styles from "./EditButton.module.scss";

interface EditButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "cancel";
}

const EditButton: React.FC<EditButtonProps> = ({
  onClick,
  children,
  type = "button",
  variant = "default",
}) => {
  return (
    <button
      type={type}
      className={
        variant === "cancel"
          ? `${styles.editButton} ${styles.cancelButton}`
          : styles.editButton
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default EditButton;
