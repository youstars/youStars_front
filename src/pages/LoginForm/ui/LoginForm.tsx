import { useState } from "react";
import classes from "./LoginForm.module.scss";
import blackApple from "shared/images/blackApple.svg";
import whiteApple from "shared/images/whiteApple.svg";
import { useTheme } from "app/provider/lib_lib/useTheme";
import { useMemo } from "react";
import { Button, Input } from "shared/index";
import google from "shared/images/google.svg";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { login } from "shared/store/slices/authSlice";

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
    <form className={classes.blockForm} onSubmit={handleSubmit}>
      <h2>{t("Log in your account")}</h2>
      <hr className={classes.hrSubTitle} />
      <div className={classes.blockInputs}>
        <fieldset className={classes.fieldEmail}>
          <label className={classes.label}>{t("User name")}</label>
          <Input className={classes.input}
                        type='username'
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required />
        </fieldset>
        <fieldset className={classes.fieldPassword}>
          <label className={classes.label}>{t("Password")}</label>
          <Input className={classes.input}
                        type='password'
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required />
        </fieldset>
        <Button
                    className={classes.buttonLogIn}
                    type="submit"
                    disabled={loading}
                >
                    {loading ? t("Logging in...") : t("Log in")}
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
        <Link to="/create-account/specialists">
          <Button className={classes.createAccount}>
            {t("Create an account")}
          </Button>
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;


