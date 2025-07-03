import classes from "./Header.module.scss";
import whiteLogo from "shared/images/whiteLogo.svg";
import blackLogo from "shared/images/blackLogo.svg";
import React, {useState, useEffect} from "react";
import darkIcon from "shared/images/dark.svg";
import lightIcon from "shared/images/light.svg";
import Button from "shared/UI/Button/Button";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import {useTheme} from "shared/providers/theme/useTheme";

const Header: React.FC = () => {
    const {theme, toggleTheme} = useTheme();
    const [logo, setLogo] = useState<string>(whiteLogo);
    const [icon, setIcon] = useState<string>(lightIcon);
    const {t} = useTranslation();

    const [role, setRole] = useState<"specialists" | "business">(() => {
        return (
            (localStorage.getItem("role") as "specialists" | "business") ||
            "specialists"
        );
    });

    const handleRoleChange = (newRole: "specialists" | "business") => {
        setRole(newRole);
        localStorage.setItem("role", newRole);
        console.log(newRole, "newRole");
    };

    useEffect(() => {
        if (theme === "dark") {
            setIcon(lightIcon);
            setLogo(blackLogo);
        } else {
            setIcon(darkIcon);
            setLogo(whiteLogo);
        }
    }, [theme, blackLogo]);

    return (
        <header className={classes.header}>
            <div className={classes.logo}>
                <Link to="/">
                    <img src={logo} alt="logo"/>
                </Link>
            </div>

            <div className={classes.buttons}>
                <div>
                    <Button
                        className={`${classes.btn} ${
                            role === "specialists" ? classes.selected : classes.transparent
                        }`}
                        onClick={() => handleRoleChange("specialists")}
                    >
                        {t("For specialists")}
                    </Button>

                    <Button
                        className={`${classes.btn} ${
                            role === "business" ? classes.selected : classes.transparent
                        }`}

                        onClick={() => handleRoleChange("business")}
                    >
                        {t("For business")}
                    </Button>
                </div>

                <div className={classes.images}>
                    <img onClick={toggleTheme} src={icon} alt="theme-icon"/>
                    <LanguageSwitcher/>
                    {/*<p onClick={changeLanguage}>LEN</p>*/}
                </div>
            </div>
        </header>
    );
};

export default Header;
