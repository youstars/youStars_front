import React, {useEffect, useState} from 'react';
import classes from './Options.module.scss'
import dashboardIcon from "shared/images/dashboard.svg";
import {useTranslation} from "react-i18next";

const Options = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [leftBoardPosition, setLeftBoardPosition] = useState<number>(0);
    const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);
    const {t} = useTranslation()
    const menuOptions = [t('Dashboard'), t('Projects'),t('Tasks'), t('Teams'),t('Library') ,t('Settings') ];

    const toggleOptionsVisibility = (): void => {
        setIsOptionsVisible(prev => !prev);
    };

    const handleOptionClick = (index: number): void => {
        setActiveIndex(index);
    };

    useEffect(() => {
        const optionElements = document.querySelectorAll<HTMLParagraphElement>(`.${classes.options} p`);
        if (optionElements[activeIndex]) {
            const selectedElement = optionElements[activeIndex];
            setLeftBoardPosition(selectedElement.offsetTop);
        }
    }, [activeIndex]);

    return (
        <div className={classes.block}>
            <div className={classes.dashboardContainer}>
                {isOptionsVisible && (
                    <div className={classes.leftBoard} style={{top: `${leftBoardPosition}px`}}></div>
                )}
                <div className={classes.dashboard}>
                    <img
                        src={dashboardIcon}
                        alt="dashboard"
                        onClick={toggleOptionsVisibility}
                    />
                </div>
                {isOptionsVisible && (
                    <div className={classes.options}>
                        {menuOptions.map((option, index) => (
                            <p
                                key={index}
                                className={index === activeIndex ? classes.active : ''}
                                onClick={() => handleOptionClick(index)}
                            >
                                {option}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Options;
