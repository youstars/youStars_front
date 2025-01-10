import classes from './InitialForms.module.scss';
import {Input} from "shared/index";
import {useTranslation} from "react-i18next";

const InitialForms = () => {
    const {t} = useTranslation()
    return (
        <div>
            <div className={classes.formName}>
                <div className={classes.name}>
                    <p className={classes.paragraph}>{t('Name*')}</p>
                    <Input type='text'/>
                </div>
                <div className={classes.lastName}>
                    <p className={classes.paragraph}>{t('Last name*')}</p>
                    <Input type='text'/>
                </div>
            </div>

            <div className={classes.middleName}>
                <p className={classes.paragraph}>{t('Middle name')}</p>
                <Input type='text'/>
            </div>
            <div className={classes.formName}>
                <div className={classes.name}>
                    <p className={classes.paragraph}>{t('Phone')}</p>
                    <Input type='number'/>
                </div>
                <div className={classes.lastName}>
                    <p className={classes.paragraph}>{t('Email')}</p>
                    <Input type='text'/>
                </div>
            </div>
        </div>
    );
};

export default InitialForms;
