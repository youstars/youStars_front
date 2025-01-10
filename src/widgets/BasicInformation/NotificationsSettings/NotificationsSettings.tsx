import {Button, Input} from "shared/index";
import classes from './NotificationsSettings.module.scss'
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

const NotificationsSettings = () => {
    const {t} = useTranslation()
    return (
        <div>
            <h3 className={classes.title}>{t('Notifications and Settings')}</h3>
            <div className={classes.mainBlock}>
                <div className={classes.blockNotifications}>
                    <span className={classes.titleNotifications}>{t('Notifications')}</span>
                    <Input className={classes.input} type='text'/>
                </div>
                <div className={classes.blockTelegram}>
                    <span className={classes.titleTelegram}>Id {t('Telegram')}</span>
                    <Input className={classes.input} type='text'/>
                </div>
            </div>

            <div className={classes.blockButton}>
                <Link to='/managers'>
                <Button className={classes.saveButton}>{t('Save')}</Button>
                </Link>
            </div>


        </div>
    );
};

export default NotificationsSettings;
