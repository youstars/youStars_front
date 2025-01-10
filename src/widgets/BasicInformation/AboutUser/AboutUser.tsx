import classes from './AboutUser.module.scss'
import {Input} from "shared/index";
import {useTranslation} from "react-i18next";

const AboutUser = () => {
    const {t} = useTranslation();
    return (
        <div className={classes.blockAboutUser}>
            <h3 className={classes.titleAbout}>{t('About you')}</h3>
            <div className={classes.aboutForm}>
                <div className={classes.coutryFom}>
                    <div className={classes.titleAndInput}>
                        <span className={classes.title}>{t('Country')}</span>
                        <Input className={classes.input} type='text'/>
                    </div>
                    <div className={classes.textareaFotm}>
                        <span className={classes.title}>{t('About yourself (professional interests)')}</span>
                        <textarea className={classes.textarea}/>
                    </div>
                </div>
                <div className={classes.inputs}>
                    <div className={classes.hoursTitle}>
                        <span className={classes.title}>{t('Hours per week')}</span>
                        <Input className={classes.input} type='text'/>
                    </div>
                    <div className={classes.availabilityTitle}>
                        <span className={classes.title}>{t('Availability by day of the week')}</span>
                        <Input className={classes.input} type='text'/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUser;
