import React, { useMemo, useState } from "react";
import blackApple from "shared/images/blackApple.svg";
import whiteApple from "shared/images/whiteApple.svg";
import { useTranslation } from "react-i18next";
import classes from "./CreatedAccount.module.scss";
import { Link } from "react-router-dom";
import { useTheme } from "app/provider/lib/useTheme";
import google from "shared/images/google.svg";
import { Button, Input } from "shared/index";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { register } from "shared/store/slices/authSlice";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {Header} from "../../../widgets/Header";


const CreateAccount = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const { role } = useParams<"role">();
  const navigate = useNavigate();


  const icon = useMemo(() => {
    return theme === "dark" ? whiteApple : blackApple;
  }, [theme]);


  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    full_name: Yup.string()
      .required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .test(
        "not-similar-to-username",
        "Password is too similar to the username",
        function (value) {
          const username = this.resolve(Yup.ref("username")) as string; // Явно указываем тип
          return value && username ? !value.includes(username) : true;
        }
      )
      .required("Password is required"),
    re_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation is required"),
  });


  return (
      <>
          <Header/>

    <Formik
    initialValues={{
      username: "",
      full_name: "",
      email: "",
      password: "",
      re_password: "",
    }}
    validationSchema={validationSchema}
    onSubmit={async (values, { setSubmitting }) => {
      try {
        const resultAction = await dispatch(register({ role: role || "customers", formData: values }));
        if (register.fulfilled.match(resultAction)) {
          navigate("/");
        }
      } catch (error) {
        console.error("Registration failed:", error);
      } finally {
        setSubmitting(false);
      }
    }}
  >
    {({ isSubmitting }) => (
      <Form className={classes.blockForm}>
        <h2>{t("Create your account")}</h2>
        <hr className={classes.hrSubTitle} />
        <div className={classes.blockInputs}>
          <fieldset className={`${classes.fieldName} ${classes.fieldContainer}`}>
            <label className={classes.label}>{t("Name")}</label>
            <Field
              className={classes.input}
              type="text"
              name="username"
            />
            <ErrorMessage name="username" component="div" className={classes.error} />
          </fieldset>
          <fieldset className={`${classes.fieldLastName} ${classes.fieldContainer}`}>
            <label className={classes.label}>{t("Last name")}</label>
            <Field
              className={classes.input}
              type="text"
              name="full_name"
            />
            <ErrorMessage name="full_name" component="div" className={classes.error} />
          </fieldset>
          <fieldset className={`${classes.fieldEmail} ${classes.fieldContainer}`}>
            <label className={classes.label}>{t("Email or phone number")}</label>
            <Field
              className={classes.input}
              type="email"
              name="email"
            />
            <ErrorMessage name="email" component="div" className={classes.error} />
          </fieldset>
          <fieldset className={`${classes.fieldPassword} ${classes.fieldContainer}`}>
            <label className={classes.label}>{t("Password")}</label>
            <Field
              className={classes.input}
              type="password"
              name="password"
            />
            <ErrorMessage name="password" component="div" className={classes.error} />
          </fieldset>
          <fieldset className={`${classes.fieldPassword} ${classes.fieldContainer}`}>
            <label className={classes.label}>{t("Password confirmation")}</label>
            <Field
              className={classes.input}
              type="password"
              name="re_password"
            />
            <ErrorMessage name="re_password" component="div" className={classes.error} />
            </fieldset>
        <fieldset className={classes.fieldCheckbox}>
          <Field
            type="checkbox"
            name="terms"
            className={classes.checkbox}
          />
          <span className={classes.checkboxContent}>
            {t(
              "By creating an account, I agree to the YouStar Terms of Use and Privacy Policy."
            )}
          </span>
          <ErrorMessage name="terms" component="div" className={classes.error} />
        </fieldset>

        <Button
          className={classes.buttonContinue}
          type="submit"
          disabled={isSubmitting || loading}
        >
          {isSubmitting || loading ? t("Loading...") : t("Continue")}
        </Button>
      </div>
      {error && typeof error === "object" ? (
        <ul className={classes.errorList}>
          {Object.entries(error).map(([key, value]) => (
            <li key={key} className={classes.errorItem}>
              {t(key)}: {typeof value === "string" ? t(value) : t("Unknown error")}
            </li>
          ))}
        </ul>
      ) : (
        error && <p className={classes.error}>{t(String(error))}</p>
      )}
      <div className={classes.horizont}>
        <hr className={classes.horizont_hr} />
        <p className={classes.horizont_p}>{t("Or")}</p>
        <hr className={classes.horizont_hr} />
      </div>

      <div className={classes.continue}>
        <Button className={classes.withGoogle}>
          <img className={classes.google} src={google} alt="google" />
          <p className={classes.paragraph}>{t("Continue with Google")}</p>
        </Button>
        <Button className={classes.withApple}>
          <img className={classes.apple} src={icon} alt="apple" />
          <p className={classes.paragraph}>{t("Continue with Apple")}</p>
        </Button>
        <div className={classes.accountLogin}>
          <p>{t("Do you already have an account?")}</p>
          <Link to="/">
            <Button className={classes.createAccount}>{t("Log in")}</Button>
          </Link>
        </div>
      </div>
    </Form>
  )}
</Formik>
      </>
  )}


export default CreateAccount;
