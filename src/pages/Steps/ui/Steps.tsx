import {Button} from "shared/index";
import {useTranslation} from "react-i18next";
import person from 'shared/images/person.svg'
import classes from './Steps.module.scss'
import {getTasks} from "shared/store/slices/tasksSlice";
import {useDispatch} from "react-redux";
import {AppDispatch} from "shared/store";
import {useEffect} from "react";

const Steps = () => {
    const {t} = useTranslation();


    return (
        <div className={classes.blockTest}>
            <div>
                <h2>{t('First steps')}</h2>
                <span className={classes.span}></span>
            </div>
            <div className={classes.contentBlock}>
                <p>{t('Do you want to set up basic profile data now or later?')}</p>
                <img className={classes.person} src={person} alt="person"/>
                <div className={classes.buttons}>
                    <Button>{t('Later')}</Button>
                    <Button>{t('Fill out a profile')}</Button>
                </div>
            </div>
        </div>
    );
};

export default Steps;
