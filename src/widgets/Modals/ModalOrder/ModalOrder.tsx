import React, {useState} from 'react';
// @ts-ignore
import DatePicker, {registerLocale} from 'react-datepicker';
import  ru from 'date-fns/locale/ru'
import 'react-datepicker/dist/react-datepicker.css';
import styles from './ModalOrder.module.scss';
import R from 'shared/images/R.svg';
import Y from 'shared/images/Y.svg';
import D from 'shared/images/D.svg';
import E from 'shared/images/E.svg';
import DT from 'shared/images/DT.svg';

registerLocale('ru', ru);

interface Currency {
    value: string;
    label: string;
    icon: string;
}

const currencies: Currency[] = [
    {value: 'USD', label: 'Доллар', icon: D},
    {value: 'EUR', label: 'Евро', icon: E},
    {value: 'RUB', label: 'Рубль', icon: R},
    {value: 'JPY', label: 'Йена', icon: Y},
];

interface ModalOrdersProps {
    closeModal: () => void;
}

const ModalOrders: React.FC<ModalOrdersProps> = ({closeModal}) => {
    const [taskSolution, setTaskSolution] = useState<string>('');
    const [businessProblem, setBusinessProblem] = useState<string>('');
    const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [startDate, endDate] = dateRange;

    const handleDateChange = (update: [Date | null, Date | null]) => {
        setDateRange(update);
    };

    return (
        <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.formContainer}>
                    <h3 className={styles.title}>Новая заявка</h3>
                    <div className={styles.line}/>
                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="taskSolution">Какую задачу вы хотите выполнить</label>
                            <textarea
                                id="taskSolution"
                                value={taskSolution}
                                onChange={(e) => setTaskSolution(e.target.value)}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.lbl} htmlFor="businessProblem">Проблема в бизнесе, которую вы хотите <br/> решить своим
                                заказом</label>
                            <textarea
                                className={styles.label}
                                id="businessProblem"
                                value={businessProblem}
                                onChange={(e) => setBusinessProblem(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.selectRow}>
                        <div className={styles.selectGroup}>
                            <label>Бюджет</label>
                            <div className={styles.customSelect}>
                                <div
                                    className={styles.selectedCurrency}
                                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                                >
                                    <img
                                        src={selectedCurrency.icon}
                                        alt={selectedCurrency.label}
                                        className={styles.currencyIcon}
                                    />
                                </div>
                                {isDropdownOpen && (
                                    <div className={styles.dropdown}>
                                        <p className={styles.valuto}>Валюта</p>
                                        <div className={styles.line}/>
                                        {currencies.map((currency) => (
                                            <div
                                                key={currency.value}
                                                className={`${styles.dropdownItem} ${selectedCurrency.value === currency.value ? styles.selected : ''}`}
                                                onClick={() => {
                                                    setSelectedCurrency(currency);
                                                    setDropdownOpen(false);
                                                }}
                                            >
                                                <div className={styles.currencyInfo}>
                                                    <img
                                                        src={currency.icon}
                                                        alt={currency.label}
                                                        className={styles.dropdownIcon}
                                                    />
                                                    <span className={styles.currencyLabel}>{currency.label}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.selectGroup}>
                            <label>Дедлайн</label>
                            <div className={styles.datepickerWrapper}>
                                <img className={styles.dt} src={DT} alt=""/>
                                <DatePicker
                                    selectsRange
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={handleDateChange}
                                    locale="ru"
                                    dateFormat="dd.MM.yyy"
                                    className={styles.currencySelect}
                                    renderCustomHeader={({
                                                             date,
                                                             decreaseMonth,
                                                             increaseMonth,
                                                             prevMonthButtonDisabled,
                                                             nextMonthButtonDisabled,

                                                         }) => (
                                        <div className="month-navigation">
                                            <span className="react-datepicker__current-month">
                                                {date.toLocaleString('ru', {month: 'long', year: 'numeric'})}
                                            </span>
                                            <button
                                                onClick={decreaseMonth}
                                                disabled={prevMonthButtonDisabled}
                                                type="button"
                                            >
                                                ▲
                                            </button>
                                            <button
                                                onClick={increaseMonth}
                                                disabled={nextMonthButtonDisabled}
                                                type="button"
                                            >
                                                ▼
                                            </button>
                                        </div>
                                    )}
                                    dayClassName={(date) => {
                                        const day = date.getDay();
                                        return (day === 0 || day === 6) ? 'react-datepicker__day--weekend' : undefined;
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.submitButtonWrapper}>
                        <button className={styles.submitButton} onClick={closeModal}>
                            Оставить заявку
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalOrders;
