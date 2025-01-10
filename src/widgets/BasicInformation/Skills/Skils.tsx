import classes from './Skils.module.scss';
import {Button, Input} from "shared/index";
import {useTranslation} from "react-i18next";

const Skils = () => {
    const {t} = useTranslation()
    return (
        <div className={classes.blockSkils}>
            <h3 className={classes.title}>{t('Additional skills and certificates')}</h3>
            <div className={classes.formName}>
                <div className={classes.name}>
                    <p className={classes.paragraph}>{t('Specializations')}</p>
                    <Input type='text'/>
                </div>
                <div className={classes.lastName}>
                    <div className={classes.inputAndButton}>
                        <p className={classes.paragraph}>{t('Certificates confirming the qualification')}</p>
                        <div className={classes.addAnotherPlace}>
                            <Input type='text'/>
                            <Button className={classes.addPlaceWork}>+</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skils;
