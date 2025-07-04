import React, { useEffect, useMemo, useCallback } from "react";
import { formatCurrency } from "shared/helpers/formatCurrency";
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
import user_icon from "shared/images/user_icon.svg";
import { TrackerNotes } from "../ClientProfile/components/TrackerNotes/TrackerNotes";
import { uploadProjectFile } from "shared/api/files";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditButton from "shared/UI/EditButton/EditButtton";

import { useProject, ProjectUpdatePayload } from "./hooks/useProject";
import { useProjectForm } from "./hooks/useProjectForm";
import { useProjectChat } from "./hooks/useProjectChat";

export default function ProjectProfile() {
  const { id } = useParams();
  const { project, loading, error, update } = useProject(id);

  const {
    isEditing,
    setIsEditing,
    form,
    handleChange,
    dirtyKeys,
  } = useProjectForm(project);

  const { openProjectChat } = useProjectChat(project?.id);

  /* ---------- error toast ---------- */
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  /* ---------- save ---------- */
  const handleSave = async () => {
    const updates: Partial<ProjectUpdatePayload> = {};
    dirtyKeys.forEach((key) => {
      // приведение из‑за union у status
      (updates as any)[key] = form[key];
    });

    if (Object.keys(updates).length) {
      await update(updates);
      toast.success("Проект обновлён");
    }
    setIsEditing(false);
  };

  /* ---------- file upload ---------- */
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

  /* ---------- table columns ---------- */
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

  /* ---------- loading ---------- */
  if (loading || !project) {
    return (
      <div className={styles.loader}>
        <ProgressBar steps={["Загрузка"]} currentStep={0} />
        <ToastContainer position="bottom-right" />
      </div>
    );
  }

  /* ---------- render ---------- */
  return (
    <div className={styles.main}>
      {/* ===== HEADER ===== */}
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
                    value={form.name}
                    readOnly={false}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                ) : (
                  <h2>{project?.name || "Название проекта"}</h2>
                )}

                <p className={styles.status}>
                  {project?.status === "completed" ? "Завершён" : "В работе"}
                </p>

                <div className={styles.editBtnBlock}>
                  {isEditing ? (
                    <>
                      <EditButton onClick={handleSave}>Сохранить</EditButton>
                      <EditButton
                        variant="cancel"
                        onClick={() => setIsEditing(false)}
                      >
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
            </div>
          </div>
        </div>

        {/* ===== META ===== */}
        <div className={styles.middleBlock}>
          <div className={styles.infoGroup}>
            <p className={styles.label}>Статус:</p>
            {isEditing ? (
              <select
                className={styles.input}
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
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
                value={form.status_start_date.slice(0, 10)}
                onChange={(e) =>
                  handleChange("status_start_date", e.target.value)
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
                value={form.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
              />
            ) : (
              <p className={styles.value}>
                {formatCurrency(project?.budget)}
              </p>
            )}
          </div>

          <div className={styles.infoGroup}>
            <p className={styles.label}>Дедлайн:</p>
            {isEditing ? (
              <input
                type="date"
                className={styles.input}
                value={form.deadline.slice(0, 10)}
                onChange={(e) => handleChange("deadline", e.target.value)}
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

        {/* ===== QUICK ACTIONS ===== */}
        <div className={styles.buttons}>
          <IconButton icon={Checklist} alt="checklist" size="lg" border="none" />
          <IconButton
            icon={GroupChat}
            alt="group chat"
            size="lg"
            border="none"
            onClick={openProjectChat}
          />
          <IconButton icon={Chat} alt="chat" size="lg" border="none" />
        </div>
      </div>

      {/* ===== CLIENT / GOALS ===== */}
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
            value={form.goal}
            readOnly={!isEditing}
            onChange={(e) => handleChange("goal", e.target.value)}
          />
          <TextAreaField
            label="Решаемые проблемы"
            value={form.solving_problems}
            readOnly={!isEditing}
            onChange={(e) => handleChange("solving_problems", e.target.value)}
          />
          <TextAreaField
            label="Продукт или услуга"
            value={form.product_or_service}
            readOnly={!isEditing}
            onChange={(e) =>
              handleChange("product_or_service", e.target.value)
            }
          />
          <TextAreaField
            label="Дополнительные пожелания"
            value={form.extra_wishes}
            readOnly={!isEditing}
            onChange={(e) => handleChange("extra_wishes", e.target.value)}
          />
        </div>
      </div>

      <TrackerNotes />

      {/* ===== TEAM ===== */}
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

      {/* ===== FILES ===== */}
      <div className={styles.projectFiles}>
        <ProjectFiles files={project?.file || []} onFileSelect={handleFileSelect} />
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}
