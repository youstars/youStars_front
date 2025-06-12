import React, { useEffect, useState, useRef } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Upload,
  PlusSquare,
} from "lucide-react";
import classes from "./SideTask.module.scss";
import { useAppDispatch } from "shared/hooks/useAppDispatch";
import { useAppSelector } from "shared/hooks/useAppSelector";
import {
  getTaskById,
  selectTaskById,
  updateTask,
} from "shared/store/slices/tasksSlice";
import ModalCalendar from "widgets/Modals/ModalCalendar/ModalCalendar";
import type { Task } from "shared/types/tasks";
import ChatsIcon from "shared/assets/icons/ChatsY.svg";
import ChatIcon from "shared/assets/icons/chatY.svg";

interface Props {
  id: number;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SideTask: React.FC<Props> = ({ id, isOpen, toggleSidebar }) => {
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => selectTaskById(state, id));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notice, setNotice] = useState("");

  const [material, setMaterial] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | number | null>(
    null
  );

  const [startDate, setStartDate] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<string | null>(null);

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getTaskById(String(id)));
  }, [dispatch, id]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setNotice(task.notice || "");
      setDeadline(task.deadline || "");
      setMaterial(task.material || "");
    }
  }, [task]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        toggleSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleSidebar]);
  const handleApplyDates = (start: Date | null, end: Date | null) => {
    if (start) setStartDate(start.toISOString());
    if (end) setDeadline(end.toISOString());
    setIsCalendarOpen(false);
  };

  const handleSave = () => {
    dispatch(
      updateTask({
        id,
        data: {
          title,
          description,
          notice,
          deadline,
          material,
        },
      })
    );
  };

  if (!task) return null;

  return (
    <div
      className={`${classes.sidebarContainer} ${
        isOpen ? classes.containerOpen : ""
      }`}
    >
      <div
        ref={sidebarRef}
        className={`${classes.sidebar} ${isOpen ? classes.open : ""}`}
      >
        <button className={classes.toggleButton} onClick={toggleSidebar}>
          {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div className={classes.contentWrapper}>
          <div className={classes.content}>
            <header className={classes.header}>
              <div className={classes.bloks}>
                <div className={classes.user_img}>
                  <div className={classes.avatarCircle}>ИС</div>
                </div>
                <div className={classes.user_name}>
                  <p>Иван Соколов</p>
                  <p>трекер №2</p>
                </div>
                <div className={classes.chats}>
                  <button
                    // onClick={handleClientChat}
                    className={classes.chatButton}
                    title="Чат с клиентом"
                  >
                    <img
                      src={ChatIcon}
                      alt="Чат с клиентом"
                      className={classes.chatIcon}
                    />
                  </button>

                  <img
                    src={ChatsIcon}
                    alt="Чат с клиентом"
                    className={classes.chatIcon}
                  />
                </div>
              </div>
            </header>

            <div className={classes.title}>Название задачи</div>
            <input
              className={classes.titleInput}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className={classes.project_name}>
              <p>Дедлайн</p>
              <div
                className={classes.fidback}
                onClick={() => {
                  setSelectedTaskId(task.id);
                  setIsCalendarOpen(true);
                }}
              >
                <Calendar size={14} className={classes.icon} />
                <p>
                  {deadline ? new Date(deadline).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>

            <div className={classes.blok_paragraph}>
              <h3>
                Ожидаемый результат <span style={{ color: "red" }}>*</span>
              </h3>
              <textarea
                className={classes.titleInput}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className={classes.blok_paragraph}>
              <h3>Комментарий</h3>
              <textarea
                className={classes.titleInput}
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
              />
            </div>

            <div className={classes.blok_paragraph}>
              <h3>Материалы</h3>
              <input
                className={classes.titleInput}
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              />
            </div>

            <div className={classes.uploadWrapper}>
              <div className={classes.uploadHeader}>
                <p>Файлы</p>
                <div className={classes.uploadIcon}>
                  <Upload size={16} className={classes.icon} />
                </div>
              </div>
              <div className={classes.uploadBody}>
                <ul className={classes.fileList}>
                  {task.files?.length > 0 ? (
                    task.files.map((file, idx) => (
                      <li key={idx} className={classes.fileItem}>
                        <span className={classes.fileIcon}>📎</span>
                        {file.name}
                      </li>
                    ))
                  ) : (
                    <li className={classes.fileItem}>Нет файлов</li>
                  )}
                </ul>
              </div>
            </div>

            <button className={classes.submitButton} onClick={handleSave}>
              Сохранить
            </button>
          </div>
        </div>
      </div>
      <ModalCalendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onApply={handleApplyDates}
        tasks={[task]}
        selectedTaskId={selectedTaskId}
      />
    </div>
  );
};

export default SideTask;
