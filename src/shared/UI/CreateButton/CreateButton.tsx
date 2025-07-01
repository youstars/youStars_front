import React from "react";
import styles from "./CreateButton.module.scss";

interface CreateButtonProps {
  onClick: () => void;
    label?: string;
}

const CreateButton: React.FC<CreateButtonProps> = ({ onClick, label = "Создать заказ" })=> {
  return (
    <button className={styles.create_order} onClick={onClick}>
      {label}
    </button>
  );
};

export default CreateButton;
