import { useState } from "react";
import classes from "./LoginForm.module.scss";
import blackApple from "shared/images/blackApple.svg";
import whiteApple from "shared/images/whiteApple.svg";
import { useMemo } from "react";
import { Button, Input } from "shared/index";
import google from "shared/images/google.svg";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { login } from "shared/store/slices/authSlice";
import { CustomField } from "shared/UI/CustomField/CustomField";
import { Formik, Form } from "formik"; 
import * as Yup from "yup";
import { useTheme } from "shared/providers/theme/useTheme";


const LoginForm = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const icon = useMemo(() => {
    return theme === "dark" ? whiteApple : blackApple;
  }, [theme, google, blackApple, whiteApple]);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const validationSchema = Yup.object({
    username: Yup.string().required("Введите имя пользователя"),
    password: Yup.string().required("Введите пароль"),
  });
  console.log(formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(login(formData));
      if (login.fulfilled.match(resultAction)) {
        navigate("/test");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
   
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        try {
          const resultAction = await dispatch(login(values));
          if (login.fulfilled.match(resultAction)) {
            navigate("/test");
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className={classes.blockForm}>
          <h2>{t("Log in your account")}</h2>
          <hr className={classes.hrSubTitle} />
  
          <div className={classes.blockInputs}>
            <CustomField name="username" label="Имя пользователя" className={classes.fieldLastName} />
            <CustomField name="password" label="Пароль" type="password" className={classes.fieldPassword} />
  
            <Button className={classes.buttonLogIn} type="submit" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? t("Logging in...") : t("Log in")}
            </Button>
          </div> <div className={classes.horizont}>
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
        <Link to="/create-account">
          <Button className={classes.createAccount}>
            {t("Create an account")}
          </Button>
        </Link>
      </div>
      
        </Form>
      )}
    </Formik>

 
  )};
  export default LoginForm;