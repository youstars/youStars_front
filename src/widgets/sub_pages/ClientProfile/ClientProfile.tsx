import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { useAppSelector } from "shared/hooks/useAppSelector";
import { getClientById, updateClient } from "shared/store/slices/clientSlice";
import { updateMe } from "shared/store/slices/meSlice";
import { TrackerNotes } from "./components/TrackerNotes/TrackerNotes";
import { ProjectBlock } from "./components/ProjectBlock/ProjectBlock";
import Avatar from "shared/UI/Avatar/Avatar";
import Spinner from "shared/UI/Spinner/Spinner";
import Phone from "shared/images/clientImgs/phone.svg";
import Mail from "shared/images/clientImgs/mail.svg";
import Web from "shared/images/clientImgs/network.svg";
import Chat from "shared/images/clientImgs/Chat.svg";
import Write from "shared/images/clientImgs/Write.svg";
import { useNavigate } from "react-router-dom";
import styles from "./ClientProfile.module.scss";
import { useChatService } from "shared/hooks/useWebsocket";


const employeeOptions = [
  "Not on the market",
  "1 -5",
  "6 - 10",
  "11 -20",
  "21 - 50",
  "51 - 100",
  "101 - 250",
  "251 - 500",
  "501 - 1000",
  "More than 1000",
];
const revenueOptions = [
  "Not on market",
  "Up to 100K",
  "100K-300K",
  "300K-500K",
  "500K-1M",
  "1M-3M",
  "3M-5M",
  "5M-10M",
  "10M-20M",
  "20M-30M",
  "30M-50M",
  "50M-75M",
  "75M-100M",
  "100M-150M",
  "150M-250M",
  "250M-350M",
  "350M-500M",
  "500M-750M",
  "750M-1B",
  "Over 1B",
];
const yearsOptions = [
  "Not on market",
  "Less than 1",
  "1-2",
  "2-3",
  "3-5",
  "5-7",
  "7-10",
  "10-15",
  "15-20",
  "20-30",
  "Over 30",
];

export const ClientProfile = (): JSX.Element => {
  const navigate = useNavigate();
  const { chats, setActiveChat } = useChatService();
  const meError = useAppSelector((state) => state.me.error);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { data: client, loading } = useAppSelector((s) => s.client);
  console.log("в компоненте client.position =", client?.position);

  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({

    position: "",
    business_name: "",
    description: "",
    problems: "",
    tasks: "",
    geography: "",
    employee_count: "",
    revenue: "",
    years_on_market: "",
    professional_areas: "", 

    phone_number: "",
    email: "",
    tg_nickname: "",
    full_name: "",
  });


  useEffect(() => {
    if (id) dispatch(getClientById(+id));
  }, [id, dispatch]);


  useEffect(() => {
    if (client) console.log("[ClientProfile] получен клиент:", client);
    if (!client) return;
    setForm({
      position: client.position ?? "",
      business_name: client.business_name ?? "",
      description: client.description ?? "",
      problems: client.problems ?? "",
      tasks: client.tasks ?? "",
      geography: client.geography ?? "",
      employee_count: client.employee_count ?? "",
      revenue: client.revenue ?? "",
      years_on_market: client.years_on_market ?? "",
      professional_areas: (client.professional_areas ?? []).join(", "),
      phone_number: client.custom_user.phone_number ?? "",
      email: client.custom_user.email ?? "",
      tg_nickname: client.custom_user.tg_nickname ?? "",
      full_name: client.custom_user.full_name ?? "",
    });
  }, [client]);

  const onChange =
    (field: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSave = async () => {
  if (!client) return;

  const userDiff: Record<string, any> = {};
  ["phone_number", "email", "tg_nickname", "full_name"].forEach((f) => {
    const oldVal =
      client.custom_user[f as keyof typeof client.custom_user] ?? "";
    const newVal = form[f as keyof typeof form];
    if (newVal !== oldVal) userDiff[f] = newVal || null;
  });

  const clientDiff: Record<string, any> = {};
  const clientMap = {
    position: client.position,
    business_name: client.business_name,
    description: client.description,
    problems: client.problems,
    tasks: client.tasks,
    geography: client.geography,
    employee_count: client.employee_count,
    revenue: client.revenue,
    years_on_market: client.years_on_market,
    professional_areas: (client.professional_areas ?? []).join(","),
  };

  Object.entries(clientMap).forEach(([key, oldVal]) => {
    const newVal = (form as any)[key];
    if (newVal !== oldVal) {
      clientDiff[key] =
        key === "professional_areas"
          ? newVal
            ? newVal
                .split(",")
                .map((x: string) => Number(x.trim()))
                .filter(Boolean)
            : []
          : newVal || null;
    }
  });

  try {
    if (Object.keys(userDiff).length) {
      await dispatch(updateMe(userDiff)).unwrap();
    }
    if (Object.keys(clientDiff).length) {
      await dispatch(updateClient(clientDiff)).unwrap();
    }

    if (Object.keys(userDiff).length || Object.keys(clientDiff).length) {
      dispatch(getClientById(+id!));
    }

    setEdit(false);
} catch (err: any) {
  const serverMessage =
    err?.response?.data?.detail || err?.message || "Неизвестная ошибка";

  console.error("Ошибка обновления профиля клиента:", serverMessage);
  alert(`Ошибка: ${serverMessage}`);
}

};


  if (loading || !client) return <Spinner />;

  const u = client.custom_user;
  const handleChatClick = () => {
    const clientUserId = String(client.custom_user.id);
    const chat = chats.find((chat) =>
      chat.participants?.some((p: any) => String(p.id) === clientUserId)
    );
    if (chat) {
      setActiveChat(chat.id);
      navigate("/manager/chats");
    } else {
      alert("Чат с этим клиентом не найден.");
    }
  };

  return (
    <div className={styles.main}>
      {meError && (
  <div className={styles.errorBox}>
    <p className={styles.errorMessage}>Ошибка: {meError}</p>
  </div>
)}
      <div className={styles.container}>
        {/* ===== карточка клиента ===== */}
        <div className={styles.client}>
          <div className={styles.clientInfo}>
            <div className={styles.clientAvatar}>
              <Avatar src={u.avatar || ""} />
              <p className={styles.clientDays}>3 дня</p>
            </div>

            <div className={styles.clientText}>
              {edit ? (
                <input
                  className={styles.inputField}
                  value={form.full_name}
                  onChange={onChange("full_name")}
                  placeholder="ФИО"
                />
              ) : (
                <h3 className={styles.clientName}>{u.full_name}</h3>
              )}

              {edit ? (
                <>
                  <input
                    className={styles.inputField}
                    placeholder="Должность"
                    value={form.position}
                    onChange={onChange("position")}
                  />
                  <input
                    className={styles.inputField}
                    placeholder="Название компании"
                    value={form.business_name}
                    onChange={onChange("business_name")}
                  />
                </>
              ) : (
                <>
                  <p className={styles.clientPosition}>
                    {client.position || "—"}
                  </p>
                  <p className={styles.clientCompany}>
                    {client.business_name || "Компания не указана"}
                  </p>
                </>
              )}

              <p className={styles.clientRating}>
                Рейтинг заказчика: {client.overall_rating ?? 0}/5
              </p>

              <button
                className={styles.editButton}
                onClick={edit ? handleSave : () => setEdit(true)}
              >
                {edit ? "Сохранить" : "Изменить профиль"}
              </button>
            </div>
          </div>

          {/* --- контакты --- */}
          <div className={styles.clientContacts}>
            {edit ? (
              <>
                <input
                  className={styles.inputField}
                  value={form.phone_number}
                  onChange={onChange("phone_number")}
                  placeholder="Телефон"
                />
                <input
                  className={styles.inputField}
                  value={form.email}
                  onChange={onChange("email")}
                  placeholder="E-mail"
                />
                <input
                  className={styles.inputField}
                  value={form.tg_nickname}
                  onChange={onChange("tg_nickname")}
                  placeholder="TG ник"
                />
              </>
            ) : (
              <>
                <p className={styles.clientContact}>
                  <img src={Phone} alt="" />
                  {u.phone_number || "Не указан"}
                </p>
                <p className={styles.clientContact}>
                  <img src={Mail} alt="" />
                  {u.email || "Не указан"}
                </p>
                <p className={styles.clientContact}>
                  <img src={Web} alt="" />
                  {u.tg_nickname || "Не указан"}
                </p>
              </>
            )}
          </div>

          {/* --- метрики --- */}
          <div className={styles.clientMetrics}>
            <p className={styles.clientMetric}>
              Активных заказов: {client.orders_in_progress ?? 0}
            </p>
            <p className={styles.clientMetric}>
              Всего заказов: {client.orders_total ?? 0}
            </p>
            <p className={styles.clientMetric}>
              Средняя стоимость: {client.order_cost_avg ?? 0} ₽
            </p>
            <p className={styles.clientMetric}>
              Настроение: {client.mood ?? "—"}
            </p>
          </div>

          <div className={styles.clientIcons}>
            <button className={styles.clientIcon} onClick={handleChatClick}>
              <img src={Chat} alt="Chat" />
            </button>

            <button className={styles.clientIcon}>
              <img src={Write} alt="Write" />
            </button>
          </div>
        </div>

        {/* ===== бизнес-блоки ===== */}
        <div className={styles.businessInfo}>
          {/* описание */}
          <div className={styles.businessBlock}>
            <h4 className={styles.businessTitle}>Описание бизнеса</h4>
            {edit ? (
              <textarea
                className={styles.inputField}
                value={form.description}
                onChange={onChange("description")}
              />
            ) : (
              <p className={styles.businessEmpty}>
                {client.description || "Описание не указано"}
              </p>
            )}
          </div>

          {/* проблемы */}
          <div className={styles.businessBlock}>
            <h4 className={styles.businessTitle}>Проблемы бизнеса</h4>
            {edit ? (
              <textarea
                className={styles.inputField}
                value={form.problems}
                onChange={onChange("problems")}
              />
            ) : (
              <p className={styles.businessEmpty}>
                {client.problems || "Не указано"}
              </p>
            )}
          </div>

          {/* задачи */}
          <div className={styles.businessBlock}>
            <h4 className={styles.businessTitle}>Задачи бизнеса</h4>
            {edit ? (
              <textarea
                className={styles.inputField}
                value={form.tasks}
                onChange={onChange("tasks")}
              />
            ) : (
              <p className={styles.businessEmpty}>
                {client.tasks || "Не указано"}
              </p>
            )}
          </div>
        </div>

        {/* ===== статистика-кнопки ===== */}

        <div className={styles.businessStatistics}>
          {/* география */}
          <div className={styles.businessStatBlock}>
            <h4 className={styles.businessTitle}>География</h4>
            {edit ? (
              <input
                className={styles.inputField}
                value={form.geography}
                onChange={onChange("geography")}
                placeholder="География"
              />
            ) : (
              <p className={styles.businessStatValue}>
                {client.geography || "Не указано"}
              </p>
            )}
          </div>

          {/* сотрудники */}
          <div className={styles.businessStatBlock}>
            <h4 className={styles.businessTitle}>Количество сотрудников</h4>
            {edit ? (
              <select
                className={styles.inputField}
                value={form.employee_count}
                onChange={onChange("employee_count")}
              >
                {employeeOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <p className={styles.businessStatValue}>
                {client.employee_count || "Не указано"}
              </p>
            )}
          </div>

          {/* выручка */}
          <div className={styles.businessStatBlock}>
            <h4 className={styles.businessTitle}>Годовая выручка</h4>
            {edit ? (
              <select
                className={styles.inputField}
                value={form.revenue}
                onChange={onChange("revenue")}
              >
                {revenueOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <p className={styles.businessStatValue}>
                {client.revenue || "Не указано"}
              </p>
            )}
          </div>

          {/* лет на рынке */}
          <div className={styles.businessStatBlock}>
            <h4 className={styles.businessTitle}>Лет на рынке</h4>
            {edit ? (
              <select
                className={styles.inputField}
                value={form.years_on_market}
                onChange={onChange("years_on_market")}
              >
                {yearsOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            ) : (
              <p className={styles.businessStatValue}>
                {client.years_on_market || "Не указано"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* трек-заметки и проекты */}
      <TrackerNotes />
      {/* <ProjectBlock /> */}

      <ProjectBlock
        title="Проекты в обработке"
        projects={client.projects.filter((p) => p.status !== "completed")}
      />
      <div className={styles.projects}>
        <ProjectBlock
          title="Завершённые проекты"
          projects={client.projects.filter((p) => p.status === "completed")}
        />
      </div>
    </div>
  );
};
