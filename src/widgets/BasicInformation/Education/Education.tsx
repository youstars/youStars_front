import classes from './Education.module.scss';
import {Input} from "shared/index";
import {useTranslation} from "react-i18next";

const Education = () => {
    const {t} = useTranslation()
    return (
        <div>
            <h3 className={classes.title}>{t('Education')}</h3>
            <div className={classes.formName}>
                <div className={classes.name}>
                    <p className={classes.paragraph}>{t('Level of education')}</p>
                    <Input type='text'/>
                </div>
                <div className={classes.lastName}>
                    <p className={classes.paragraph}>{t('Educational institution')}</p>
                    <Input type='text'/>
                </div>
            </div>
            <div className={classes.formName}>
                <div className={classes.name}>
                    <p className={classes.paragraph}>{t('Faculty')}</p>
                    <Input type='number'/>
                </div>
                <div className={classes.lastName}>
                    <p className={classes.paragraph}>{t('Specialization')}</p>
                    <Input type='text'/>
                </div>
            </div>
            <div className={classes.formName}>
                <div className={classes.name}>
                    <p className={classes.paragraph}>{t('Course')}</p>
                    <Input type='text'/>
                </div>
                <div className={classes.lastName}>
                    <p className={classes.paragraph}>{t('Period of study')}</p>
                    <div className={classes.smallInputs}>
                        <Input className={classes.inps} type='number'/>
                        <Input className={classes.inps} type='number'/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Education;
