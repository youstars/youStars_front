import React from 'react'
import { Field, ErrorMessage  } from "formik";
import classes from './CustomField.module.scss';
import { useTranslation } from 'react-i18next';

interface CustomFieldProps {
  name: string;
  label: string;
  type?: string;
  className: string;
}

export const CustomField = ({ name, label, type = "text", className }: CustomFieldProps) => {
  const { t } = useTranslation();
  return (
    <fieldset className={`${className} ${classes.fieldContainer}`}>
      <label className={classes.label}>{t(label)}</label>
      <Field className={classes.input} type={type} name={name} />
      <ErrorMessage name={name} component="div" className={classes.error} />
    </fieldset>
  );
};