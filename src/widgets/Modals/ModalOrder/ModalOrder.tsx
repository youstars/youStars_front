import React, {useState} from 'react';
import DatePicker, {registerLocale} from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './ModalOrder.module.scss';
import {Calendar, Euro} from 'lucide-react';
import {useDispatch} from 'react-redux';
import {AppDispatch} from 'shared/store';
import {createOrder, getFunnelData} from 'shared/store/slices/funnelSlice';

registerLocale('ru', ru);

interface ModalOrdersProps {
    closeModal: () => void;
}

const ModalOrders: React.FC<ModalOrdersProps> = ({closeModal}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [orderGoal, setOrderGoal] = useState('');
    const [productOrService, setProductOrService] = useState('');
    const [solvingProblems, setSolvingProblems] = useState('');
    const [extraWishes, setExtraWishes] = useState('');
    const [budgetFrom, setBudgetFrom] = useState<number>(0);
    const [budgetTo, setBudgetTo] = useState<number>(0);
    const [dateFrom, setDateFrom] = useState<Date | null>(null);
    const [dateTo, setDateTo] = useState<Date | null>(null);

    const handleSubmit = async () => {
        const estimated_budget = Math.round((budgetFrom + budgetTo));
        const project_deadline = dateTo ? dateTo.toISOString() : null;

        const orderData = {
            order_goal: orderGoal,
            product_or_service: productOrService,
            solving_problems: solvingProblems,
            extra_wishes: extraWishes,
            estimated_budget,
            project_deadline,
        };

        console.log('%c Отправляем:', 'color: green', orderData);

        try {
            // @ts-ignore
            await dispatch(createOrder(orderData));
            await dispatch(getFunnelData());
            closeModal();
        } catch (e: any) {
            console.error(' Ошибка при отправке заявки:', e);
            console.log('Ответ сервера:', e?.response?.data);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.formContainer}>
                    <h3 className={styles.title}>Новая заявка</h3>
                    <div className={styles.line}/>

                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                            <label>Опишите ваш запрос<span className={styles.required}>*</span></label>
                            <textarea value={orderGoal} onChange={(e) => setOrderGoal(e.target.value)}/>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Продукт или услуга, целевая аудитория<span
                                className={styles.required}>*</span></label>
                            <textarea value={productOrService} onChange={(e) => setProductOrService(e.target.value)}/>
                        </div>
                    </div>

                    <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                            <label>Какие проблемы решает проект?</label>
                            <textarea value={solvingProblems} onChange={(e) => setSolvingProblems(e.target.value)}/>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Дополнительные пожелания</label>
                            <textarea value={extraWishes} onChange={(e) => setExtraWishes(e.target.value)}/>
                        </div>
                    </div>

                    <div className={styles.budgetDateRow}>
                        <div className={styles.budgetGroup}>
                            <label>Бюджет</label>
                            <div className={styles.budgetInputs}>
                                <div className={styles.budgetInput}>
                                    <input
                                        type="number"
                                        placeholder="от"
                                        value={budgetFrom}
                                        onChange={(e) => setBudgetFrom(Number(e.target.value))}
                                    />
                                    <Euro className={styles.currencyIcon} size={20}/>
                                </div>
                                <div className={styles.budgetInput}>
                                    <input
                                        type="number"
                                        placeholder="до"
                                        value={budgetTo}
                                        onChange={(e) => setBudgetTo(Number(e.target.value))}
                                    />
                                    <Euro className={styles.currencyIcon} size={20}/>
                                </div>
                            </div>
                        </div>

                        <div className={styles.dateGroup}>
                            <label>Срок выполнения</label>
                            <div className={styles.dateInputs}>
                                <div className={styles.dateInput}>
                                    <DatePicker
                                        selected={dateFrom}
                                        onChange={(date: Date) => setDateFrom(date)}
                                        locale="ru"
                                        dateFormat="dd.MM.yyyy"
                                        placeholderText="с"
                                        className={styles.picker}
                                    />
                                    <Calendar className={styles.calendarIcon} size={20}/>
                                </div>
                                <div className={styles.dateInput}>
                                    <DatePicker
                                        selected={dateTo}
                                        onChange={(date: Date) => setDateTo(date)}
                                        locale="ru"
                                        dateFormat="dd.MM.yyyy"
                                        placeholderText="по"
                                        className={styles.picker}
                                    />
                                    <Calendar className={styles.calendarIcon} size={20}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.submitButtonWrapper}>
                        <button className={styles.submitButton} onClick={handleSubmit}>
                            Оставить заявку
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalOrders;
