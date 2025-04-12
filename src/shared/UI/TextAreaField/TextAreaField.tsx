// shared/UI/TextAreaField/TextAreaField.tsx
import React from "react";
import styles from "./TextAreaField.module.scss";

interface TextAreaFieldProps {
  id?: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string;
  placeholder?: string;
  readOnly?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  id,
  label,
  value,
  onChange,
  name,
  placeholder,
  readOnly = false,
}) => {
  return (
    <div className={styles.fieldBlock}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        className={styles.textarea}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
};

export default TextAreaField;
