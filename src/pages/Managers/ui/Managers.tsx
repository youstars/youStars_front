import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import classes from './Managers.module.scss';
import whiteLogo from "shared/images/whiteLogo.svg";
import {useTheme} from "app/provider/lib_lib/useTheme";
import lightIcon from "shared/images/light.svg";
import blackLogo from "shared/images/blackLogo.svg";
import darkIcon from "shared/images/dark.svg";
import {Button, Input} from "shared/index";
import {useTranslation} from "react-i18next";
import LanguageSwitcher from "../../../widgets/LanguageSwitcher/LanguageSwitcher";
import Options from "../../../widgets/Users/Options/Options";
import taskPage from "../../TaskPage/TaskPage";
import TaskPage from "../../TaskPage/TaskPage";


const Managers: React.FC = () => {
    const {theme, toggleTheme} = useTheme();
    const [logo, setLogo] = useState<string>(whiteLogo);
    const [icon, setIcon] = useState<string>(lightIcon);
    const {t} = useTranslation();




    useEffect(() => {
        if (theme === 'dark') {
            setIcon(lightIcon);
            setLogo(blackLogo);
        } else {
            setIcon(darkIcon);
            setLogo(whiteLogo);
        }

    }, [theme])



    return (
        <div className={classes.block}>
            <div className={classes.logo}>
                <Link to='/'>
                    <img src={logo} alt="logo"/>
                </Link>
                <div className={classes.userAndForm}>
                    <span className={classes.title}>{t('Managers')}</span>
                    <div className={classes.profileManagers}>
                        <div className={classes.profileImages}>
                            <img src="" alt=""/>
                        </div>
                        <div className={classes.profileImages}>
                            <img src="" alt=""/>
                        </div>
                        <div className={classes.profileImages}>
                            <img src="" alt=""/>
                        </div>
                        <div className={classes.profileImages}>
                            <img src="" alt=""/>
                        </div>
                        <div className={classes.profileImages}>
                            <img src="" alt=""/>
                        </div>
                        <Button className={classes.btn}>{t('More')}</Button>
                    </div>
                </div>



<TaskPage/>

                <div className={classes.images}>
                    <span className={classes.titleForm}>{t('Search')}</span>
                    <div className={classes.forms}>
                        <div className={classes.blockForm}>
                            <Input className={classes.input} type='text'/>
                            <Button className={classes.btnSearch}>{t('Search')}</Button>
                        </div>
                    </div>
                </div>
                <img className={classes.themeIcon} onClick={toggleTheme} src={icon} alt="theme-icon"/>
                <LanguageSwitcher/>
            </div>
            <Options/>
        </div>
    );
};

export default Managers;
