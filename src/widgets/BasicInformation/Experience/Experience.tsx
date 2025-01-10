import classes from './Experience.module.scss';
import {Button, Input} from "shared/index";
import {useState} from "react";
import {useTranslation} from "react-i18next";


const Experience = () => {
    const {t} = useTranslation();
    const [valueTextarea, setValueTextarea] = useState<string>()
    return (
        <div>
            <h3 className={classes.title}>{t('Professional experience')}</h3>
            <div className={classes.formName}>
                <div className={classes.name}>
                    <p className={classes.paragraph}>{t('Place of work')}</p>
                    <Input type='text'/>
                </div>
                <div className={classes.lastName}>
                    <p className={classes.paragraph}>{t('Post')}</p>
                    <Input type='text'/>
                </div>
            </div>

            <div className={classes.formName}>
                <div className={classes.name}>
                    <p className={classes.paragraph}>{t('Main responsibilities and achievements')}</p>
                    <textarea className={classes.textarea} value={valueTextarea}/>
                </div>

                <div className={classes.lastName}>
                    <p className={classes.paragraph}>{t('Period of study')}</p>
                    <div className={classes.periodStudy}>
                        <Input className={classes.inps} type='number'/>
                        <Input className={classes.inps} type='number'/>
                    </div>
                    <div className={classes.addAnotherPlace}>
                        <p className={classes.paragraph}>{t('Add another place of work')}</p>
                        <Button className={classes.addPlaceWork}>+</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Experience;
