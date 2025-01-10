import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang:string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div>
            <p onClick={() => changeLanguage('en')}>En</p>
            <p onClick={() => changeLanguage('ru')}>Ru</p>
            <p onClick={() => changeLanguage('sp')}>Es</p>
        </div>
    );
};

export default LanguageSwitcher;
