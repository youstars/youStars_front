import { useMemo } from "react";
import blackApple from "shared/images/blackApple.svg";
import whiteApple from "shared/images/whiteApple.svg";
import { useTranslation } from "react-i18next";
import classes from "./CreatedAccount.module.scss";
import { Link, useNavigate} from "react-router-dom";
import google from "shared/images/google.svg";
import { Button } from "shared/index";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { register } from "shared/store/slices/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CustomField } from "shared/UI/CustomField/CustomField";
import { useTheme } from "shared/providers/theme/useTheme";


const CreateAccount = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const rawRole = localStorage.getItem("role") || "specialists";
  const role = rawRole === "specialists" ? "student" : "business";


  const icon = useMemo(() => {
    return theme === "dark" ? whiteApple : blackApple;
  }, [theme]);



  const initialValues = {
    username: "",
    full_name: "",
    email: "",
    password: "",
    re_password: "",
    terms: false, 
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, t("Username must be at least 3 characters"))
      .required(t("Username is required")),
    full_name: Yup.string().required(t("Full name is required")),
    email: Yup.string()
      .email(t("Invalid email address"))
      .required(t("Email is required")),
      password: Yup.string()
      .min(8, t("Password must be at least 8 characters"))
      .test(
        "not-similar-to-username",
        t("Password is too similar to the username"),
        function (value) {
          const username = this.resolve(Yup.ref("username")) as string;
          return value && username ? !value.includes(username) : true;
        }
      )
      .required(t("Password is required")),
    re_password: Yup.string()
      .oneOf([Yup.ref("password"), null], t("Passwords must match"))
      .required(t("Password confirmation is required")),
   
  });


return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const resultAction = await dispatch(
            register({ role, formData: values }) 
          );
          if (register.fulfilled.match(resultAction)) {
            navigate("/");
          }
        } catch (err) {
          console.error("Registration failed:", err);
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
            <CustomField
              name="username"
              label="Name"
              className={classes.fieldName}
            />
            
            <CustomField
              name="full_name"
              label="Last name"
              className={classes.fieldLastName}
            />
            <ErrorMessage name="username" component="div" className={classes.error} />
            <CustomField
              name="email"
              label="Email or phone number"
              type="email"
              className={classes.fieldEmail}
            />
            <CustomField
              name="password"
              label="Password"
              type="password"
              className={classes.fieldPassword}
            />
            <CustomField
              name="re_password"
              label="Password confirmation"
              type="password"
              className={classes.fieldPassword}
            />
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
              {/* <ErrorMessage name="terms" component="div" className={classes.error} /> */}
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
  );
};

export default CreateAccount;
