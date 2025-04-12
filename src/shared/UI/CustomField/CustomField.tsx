import React, { useRef } from "react";
import { Field, ErrorMessage } from "formik";
import classes from "./CustomField.module.scss";
import { useTranslation } from "react-i18next";
import { handleKeyDown } from "shared/utils/handleKeyDown";

interface CustomFieldProps {
  name: string;
  label: string;
  type?: string;
  className: string;
  nextFieldRef?: React.RefObject<HTMLInputElement>;
  isLast?: boolean;
}

export const CustomField = ({
  name,
  label,
  type = "text",
  className,
  nextFieldRef,
  isLast,
}: CustomFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  return (
    <fieldset className={`${className} ${classes.fieldContainer}`}>
      <label className={classes.label}>{t(label)}</label>
      <Field
        as="input"
        type={type}
        name={name}
        className={classes.input}
        innerRef={inputRef}
        onKeyDown={handleKeyDown(nextFieldRef, isLast)}
      />
      <ErrorMessage name={name} component="div" className={classes.error} />
    </fieldset>
  );
};
