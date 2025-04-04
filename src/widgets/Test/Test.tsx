import classes from './Test.module.scss'
import {Button} from "shared/index";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";



const Test = () => {
    const {t} = useTranslation();
    return (
        <>
        <div className={classes.blockTest}>
            <div>
                <h2>{t('Test task')}</h2>
                <span className={classes.span}></span>
            </div>
            <div className={classes.contentBlock}>
                <p>{t('Take a small test task to assess the level of your knowledge')}</p>
                <Link className={classes.link} to='/steps'>
                    <Button>{t('Next')}</Button>
                </Link>
            </div>
        </div>
        </>
    );
};

export default Test;
