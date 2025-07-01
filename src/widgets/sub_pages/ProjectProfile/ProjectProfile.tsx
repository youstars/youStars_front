import React, { useEffect, useMemo, useCallback, useState } from "react";
import styles from "./ProjectProfile.module.scss";
import Avatar from "shared/UI/Avatar/Avatar";
import Checklist from "shared/assets/icons/stripesY.svg";
import Chat from "shared/assets/icons/chatY.svg";
import GroupChat from "shared/assets/icons/ChatsY.svg";
import IconButton from "shared/UI/IconButton/IconButton";
import ProgressBar from "shared/UI/ProgressBar/ProgressBar";
import TextAreaField from "shared/UI/TextAreaField/TextAreaField";
import { TableColumn } from "./types";
import AvatarWithName from "shared/UI/AvatarWithName/AvatarWithName";
import ProjectFiles from "shared/UI/ProjectFiles/ProjectFiles";
import CustomTable from "shared/UI/CustomTable/CustomTable";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { useSelector } from "react-redux";
import {
  getProjectById,
  updateProject,
  updateProjectStatus,
  selectCurrentProject,
  selectProjectsError,
  selectProjectsStatus,
} from "shared/store/slices/projectsSlice";
import user_icon from "shared/images/user_icon.svg";
import { TrackerNotes } from "../ClientProfile/components/TrackerNotes/TrackerNotes";
import { uploadProjectFile } from "shared/api/files";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "shared/index";
import EditButton from "shared/UI/EditButton/EditButtton";

export default function ProjectProfile() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const project = useSelector(selectCurrentProject);
  const status = useSelector(selectProjectsStatus);
  const error = useSelector(selectProjectsError);
  const loading = status === "pending";

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "", // ← добавь это
    goal: "",
    solving_problems: "",
    product_or_service: "",
    extra_wishes: "",
    start_date: "",
    status: "",
    status_start_date: "",
    budget: "",
    deadline: "",
  });
  useEffect(() => {
    if (id) {
      dispatch(getProjectById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        goal: project.goal || "",
        solving_problems: project.solving_problems || "",
        product_or_service: project.product_or_service || "",
        extra_wishes: project.extra_wishes || "",
        start_date: project.start_date || "",
        status: project.status || "",
        status_start_date: project.updated_at || "",
        budget: project.budget || "",
        deadline: project.deadline || "",
      });
    }
  }, [project]);

  const handleSave = async () => {
    if (!project?.id) return;

    const allowedKeys: (keyof typeof formData)[] = [
      "name",
      "goal",
      "solving_problems",
      "product_or_service",
      "extra_wishes",
      "start_date",
      "status",
      "budget",
      "deadline",
    ];

    const updates: Partial<typeof formData> = {};

    allowedKeys.forEach((key) => {
      const formValue = formData[key];
      const originalValue = project?.[key as keyof typeof project];

      const isDifferent =
        typeof formValue === "string"
          ? formValue.trim() !== (originalValue?.toString().trim() ?? "")
          : formValue !== originalValue;

      if (isDifferent) {
        updates[key] = formValue;
      }
    });

    if (
      formData.status_start_date.trim() !==
      (project.updated_at?.toString().trim() ?? "")
    ) {
      updates.status_start_date = formData.status_start_date;
    }

    if (updates.budget) {
      updates.budget = updates.budget.toString();
    }

    await dispatch(updateProject({ id: project.id, updates }));
    toast.success("Проект обновлён");
    setIsEditing(false);
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!project?.id) {
        toast.warn("Проект ещё не загружен");
        return;
      }
      try {
        await uploadProjectFile(file, file.name, project.id, "Описание");
      } catch (error) {
        console.error("Ошибка загрузки файла:", error);
        toast.error("Не удалось загрузить файл");
      }
    },
    [project?.id]
  );

  const handleStatusToggle = async () => {
    if (!project?.id || !project.status) return;
    const newStatus =
      project.status === "in_progress" ? "completed" : "in_progress";
    await dispatch(updateProjectStatus({ id: project.id, status: newStatus }));
  };

  const specialistColumns: TableColumn<any>[] = useMemo(
    () => [
      {
        header: "ФИО",
        accessor: (row: any) => (
          <AvatarWithName src={row.avatar || user_icon} name={row.full_name} />
        ),
      },
      { header: "Всего задач", accessor: (row: any) => row.tasks_total },
      { header: "В работе", accessor: (row: any) => row.tasks_in_progress },
      { header: "На проверке", accessor: (row: any) => row.tasks_in_review },
      { header: "Выполнено", accessor: (row: any) => row.tasks_completed },
      {
        header: "% выполнено",
        accessor: (row: any) => row.tasks_completed_percent,
      },
    ],
    []
  );

  const trackerColumns: TableColumn<any>[] = useMemo(
    () => [
      {
        header: "Трекер",
        accessor: (row: any) => (
          <AvatarWithName src={row.avatar || user_icon} name={row.full_name} />
        ),
      },
      {
        header: "Задач в работе",
        accessor: (row: any) => row.tasks_in_progress,
      },
      { header: "На проверке", accessor: (row: any) => row.tasks_in_review },
      {
        header: "% выполнено",
        accessor: (row: any) => row.tasks_completed_percent,
      },
    ],
    []
  );

  if (loading || !project) {
    return (
      <div className={styles.loader}>
        <ProgressBar steps={["Загрузка"]} currentStep={0} />
        <ToastContainer position="bottom-right" />
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.upperHeader}>
          <div className={styles.leftBlock}>
            <div className={styles.descrContainer}>
              <div className={styles.projectIcon}>
                <Avatar size={"60px"} />
              </div>
              <div className={styles.projectInfo}>
                {isEditing ? (
                  <TextAreaField
                    label=""
                    value={formData.name}
                    readOnly={false}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                ) : (
                  <h2>{project?.name || "Название проекта"}</h2>
                )}

                <p>
                  Начало:{" "}
                  {project?.start_date
                    ? new Date(project.start_date).toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>
          <div></div>
        </div>

        <div className={styles.middleBlock}>
          <div className={styles.infoGroup}>
            <p className={styles.label}>Статус:</p>
            {isEditing ? (
              <select
                className={styles.input}
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <option value="in_progress">В работе</option>
                <option value="completed">Завершён</option>
              </select>
            ) : (
              <p className={styles.value}>
                {project.status === "completed" ? "Завершён" : "В работе"}
              </p>
            )}
          </div>

          <div className={styles.infoGroup}>
            <p className={styles.label}>Начало статуса:</p>
            {isEditing ? (
              <input
                type="date"
                className={styles.input}
                value={formData.status_start_date.slice(0, 10)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status_start_date: e.target.value,
                  }))
                }
              />
            ) : (
              <p className={styles.value}>
                {project?.updated_at
                  ? new Date(project.updated_at).toLocaleDateString()
                  : "-"}
              </p>
            )}
          </div>

          <div className={styles.infoGroup}>
            <p className={styles.label}>Стоимость:</p>
            {isEditing ? (
              <input
                type="number"
                className={styles.input}
                value={formData.budget}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    budget: e.target.value,
                  }))
                }
              />
            ) : (
              <p className={styles.value}>
                {project?.budget != null
                  ? `${Math.trunc(+project.budget).toLocaleString("ru-RU")} ₽`
                  : "—"}
              </p>
            )}
          </div>

          <div className={styles.infoGroup}>
            <p className={styles.label}>Дедлайн:</p>
            {isEditing ? (
              <input
                type="date"
                className={styles.input}
                value={formData.deadline.slice(0, 10)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deadline: e.target.value,
                  }))
                }
              />
            ) : (
              <p className={styles.value}>
                {project?.deadline
                  ? new Date(project.deadline).toLocaleDateString()
                  : "—"}
              </p>
            )}
          </div>
        </div>

        <div className={styles.buttons}>
          <IconButton
            icon={Checklist}
            alt="checklist"
            size="lg"
            border="none"
          />
          <IconButton
            icon={GroupChat}
            alt="group chat"
            size="lg"
            border="none"
          />
          <IconButton icon={Chat} alt="chat" size="lg" border="none" />
        </div>
        <div className={styles.editBtnBlock}>
          {isEditing ? (
            <>
              <EditButton onClick={handleSave}>Сохранить</EditButton>
              <EditButton variant="cancel" onClick={() => setIsEditing(false)}>
                ✖ Отменить
              </EditButton>
            </>
          ) : (
            <EditButton onClick={() => setIsEditing(true)}>
              Изм. профиль
            </EditButton>
          )}
        </div>
      </div>

      <div className={styles.projectDetails}>
        <div className={styles.clientCard}>
          <div className={styles.clientHeader}>
            <Avatar size={"60px"} />
            <div>
              <p className={styles.clientLabel}>Клиент</p>
              <p>{project?.client?.full_name || "—"}</p>
              <p>{project?.client?.business_name || "—"}</p>
            </div>
          </div>

          <div className={styles.clientInfo}>
            <p>
              <b>Рейтинг клиента:</b> 4/5
            </p>
            <p>
              <b>Активность:</b> TODO
            </p>
            <p>
              <b>Настроение:</b> 4.8/5
            </p>
            <p>
              <b>Последний контакт:</b> TODO
            </p>
          </div>
        </div>

        <div className={styles.projectFields}>
          <TextAreaField
            label="Задача проекта"
            value={formData.goal}
            readOnly={!isEditing}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, goal: e.target.value }))
            }
          />
          <TextAreaField
            label="Решаемые проблемы"
            value={formData.solving_problems}
            readOnly={!isEditing}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                solving_problems: e.target.value,
              }))
            }
          />
          <TextAreaField
            label="Продукт или услуга"
            value={formData.product_or_service}
            readOnly={!isEditing}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                product_or_service: e.target.value,
              }))
            }
          />
          <TextAreaField
            label="Дополнительные пожелания"
            value={formData.extra_wishes}
            readOnly={!isEditing}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                extra_wishes: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <TrackerNotes />

      <div className={styles.teamProject}>
        <h1>Команда проекта</h1>
        <CustomTable
          data={
            project?.project_team?.tracker ? [project.project_team.tracker] : []
          }
          columns={trackerColumns}
          initialCount={1}
        />
        <CustomTable
          data={project?.project_team?.specialists || []}
          columns={specialistColumns}
          initialCount={2}
        />
      </div>

      <div className={styles.projectFiles}>
        <ProjectFiles
          files={project?.file || []}
          onFileSelect={handleFileSelect}
        />
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}
