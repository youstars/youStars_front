import React from 'react'
import classes from "./CreatedAccount.module.scss";
import { useTranslation } from 'react-i18next';

export default function Check() {
      const { t } = useTranslation();
    
  return (
           <fieldset className={classes.fieldCheckbox}>
  <label className={classes.checkboxLabel}>
    <input
      type="checkbox"
      className={classes.checkbox}
      onChange={(e) => console.log("Test checkbox changed:", e.target.checked)}
    />
    <span className={classes.checkboxContent}>
      {t(
        "By creating an account, I agree to the YouStar Terms of Use and Privacy Policy."
      )}
    </span>
  </label>
  <p>Test checkbox checked: {false.toString()}</p>
</fieldset>
  )
}
