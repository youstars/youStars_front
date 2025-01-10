import classes from "./Header.module.scss";
import whiteLogo from "shared/images/whiteLogo.svg";
import blackLogo from "shared/images/blackLogo.svg";
import {useTheme} from "app/provider/lib/useTheme";
import React, {useState, useEffect} from "react";
import darkIcon from "shared/images/dark.svg";
import lightIcon from "shared/images/light.svg";
import Button from "shared/UI/Button/Button";
import {useTranslation} from "react-i18next";
import {Link, useNavigate, useParams} from "react-router-dom";
import LanguageSwitcher from "../../LanguageSwitcher/LanguageSwitcher";


const Header: React.FC = () => {
    const {theme, toggleTheme} = useTheme();
    const [selectedButton, setSelectedButton] = useState<'specialists' | 'customers'>('specialists');
    const [logo, setLogo] = useState<string>(whiteLogo);
    const [icon, setIcon] = useState<string>(lightIcon);
    const {t, i18n} = useTranslation();
    const { role } = useParams<"role">();
const navigate = useNavigate();
    // const changeLanguage = (lang) => {
    //     i18n.changeLanguage(lang);
    // };

    useEffect(() => {
        if (theme === 'dark') {
            setIcon(lightIcon);
            setLogo(blackLogo);
        } else {
            setIcon(darkIcon);
            setLogo(whiteLogo);
        }
    }, [theme,blackLogo]);


    return (
        <header className={classes.header}>
            <div className={classes.logo}>
                <Link to='/'>
                <img src={logo} alt="logo"/>
                </Link>
            </div>

            <div className={classes.buttons}>
                <div>
                    {/*<Link to="">*/}
                        <Button
                            className={`${classes.btn} ${selectedButton === 'specialists' 
                                ? classes.selected 
                                : classes.transparent}`}
                            onClick={() => setSelectedButton('specialists')}
                        >
                            {t('For specialists')}
                        </Button>
                    {/*</Link>*/}
                    {/*<Link to="">*/}
                        <Button
                            className={`${classes.btn} ${selectedButton === 'customers' ? classes.selected : classes.transparent}`}
                            onClick={() => setSelectedButton('customers')}
                        >
                            {t('For customers')}
                        </Button>
                    {/*</Link>*/}
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
