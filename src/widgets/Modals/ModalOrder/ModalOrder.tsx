import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./ModalOrder.module.scss";
import { Calendar, RussianRuble } from "lucide-react";
import { createOrder, getFunnelData } from "shared/store/slices/funnelSlice";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { useAppSelector } from "shared/hooks/useAppSelector";
import { useEffect } from "react";
import { getClients } from "shared/store/slices/clientsSlice";
import * as yup from "yup";

registerLocale("ru", ru);

interface ModalOrdersProps {
  closeModal: () => void;
}
export const orderSchema = yup.object().shape({
  order_goal: yup.string().required("Поле обязательно"),
  product_or_service: yup.string().required("Поле обязательно"),
  estimated_budget: yup
    .string()
    .matches(/^\d+\s*-\s*\d+$/, "Укажите диапазон, например: 1000 - 5000")
    .required("Укажите бюджет"),
  project_deadline: yup.date().required("Укажите срок выполнения"),
  client: yup.string().nullable().when("userRole", {
    is: (role: string) => role !== "Client",
    then: (schema) => schema.required("Выберите клиента"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const ModalOrders: React.FC<ModalOrdersProps> = ({ closeModal }) => {
  const dispatch = useAppDispatch();
  const [orderGoal, setOrderGoal] = useState("");
  const [productOrService, setProductOrService] = useState("");
  const [solvingProblems, setSolvingProblems] = useState("");
  const [extraWishes, setExtraWishes] = useState("");
  const [budgetFrom, setBudgetFrom] = useState<number | string>("");
  const [budgetTo, setBudgetTo] = useState<number | string>("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
const [formTouched, setFormTouched] = useState(false);

  const clients = useAppSelector((state) => state.clients.list);

  const { data: me } = useAppSelector((state) => state.me);
  const userRole = me?.role;

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);




const handleSubmit = async () => {
  const estimated_budget = `${budgetFrom.toString().trim()} - ${budgetTo.toString().trim()}`;
  const project_deadline = dateTo ? dateTo.toISOString() : null;
setFormTouched(true);

  const orderData = {
    order_goal: orderGoal,
    product_or_service: productOrService,
    solving_problems: solvingProblems,
    extra_wishes: extraWishes,
    estimated_budget,
    project_deadline,
    client: selectedClientId,
    userRole,
  };

  try {
    await orderSchema.validate(orderData, { abortEarly: false });
    setErrors({});

    // @ts-ignore
    await dispatch(createOrder(orderData));
    await dispatch(getFunnelData());
    closeModal();
  } catch (err: any) {
    if (err.name === "ValidationError") {
      const newErrors: Record<string, string> = {};
      err.inner.forEach((e: any) => {
        if (e.path) newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
    } else {
      console.error("Ошибка при отправке:", err);
    }
  }
};


  return (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.formContainer}>
          <h3 className={styles.title}>Новая заявка</h3>
          <div className={styles.line} />

          <div className={styles.inputRow}>
           <div className={styles.inputGroup}>
  <label>
    Опишите ваш запрос<span className={styles.required}>*</span>
  </label>
  <textarea
    value={orderGoal}
    onChange={(e) => setOrderGoal(e.target.value)}
  />
  {errors.order_goal && <p className={styles.errorText}>{errors.order_goal}</p>}
</div>

            <div className={styles.inputGroup}>
  <label>
    Продукт или услуга, целевая аудитория
    <span className={styles.required}>*</span>
  </label>
  <textarea
    value={productOrService}
    onChange={(e) => setProductOrService(e.target.value)}
  />
{formTouched && errors.product_or_service && (
  <p className={styles.errorText}>{errors.product_or_service}</p>
)}

</div>

          </div>

          <div className={styles.inputRow}>
            <div className={styles.inputGroup}>
              <label>Какие проблемы решает проект?</label>
              <textarea
                value={solvingProblems}
                onChange={(e) => setSolvingProblems(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Дополнительные пожелания</label>
              <textarea
                value={extraWishes}
                onChange={(e) => setExtraWishes(e.target.value)}
              />
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
        onChange={(e) => setBudgetFrom(e.target.value)}
      />
      <RussianRuble className={styles.currencyIcon} size={20} />
    </div>
    <div className={styles.budgetInput}>
      <input
        type="number"
        placeholder="до"
        value={budgetTo}
        onChange={(e) => setBudgetTo(e.target.value)}
      />
      <RussianRuble className={styles.currencyIcon} size={20} />
    </div>
  </div>

  {formTouched && errors.estimated_budget && (
    <p className={styles.errorText}>{errors.estimated_budget}</p>
  )}
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
                  <Calendar className={styles.calendarIcon} size={20} />
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
                  <Calendar className={styles.calendarIcon} size={20} />
                </div>
              </div>
               {formTouched && errors.project_deadline && (
    <p className={styles.errorText}>{errors.project_deadline}</p>
  )}
            </div>
          </div>
          {userRole !== "Client" && (
            <div className={styles.inputGroup}>
              <label>
                Выберите клиента <span className={styles.required}>*</span>
              </label>
              <select
                value={selectedClientId || ""}
                onChange={(e) => setSelectedClientId(e.target.value || null)}
              >
                <option value="" disabled>
                  Выберите клиента
                </option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.custom_user.full_name}
                  </option>
                ))}
              </select>
            </div>
          )}

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
