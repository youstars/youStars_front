import classes from './CreatePasword.module.scss'
import {Button, Input} from "shared/index";
import {useTranslation} from "react-i18next";

const CreatePassword = () => {
    const {t} = useTranslation();
    return (
        <div className={classes.userConfirmation}>
            <h2>{t('Create your account')}</h2>
            <div className={classes.blockInputs}>
                <fieldset className={classes.fieldName}>
                    <label className={classes.label}>{t('Password')}</label>
                    <Input className={classes.input} type='password'/>
                </fieldset>
                <fieldset className={classes.fieldLastName}>
                    <label className={classes.label}>{t('Password confirmation')}</label>
                    <Input className={classes.input} type='password'/>
                </fieldset>
                <Button className={classes.buttonContinue}>{t('Continue')}</Button>
            </div>
        </div>
    );
};

export default CreatePassword;
