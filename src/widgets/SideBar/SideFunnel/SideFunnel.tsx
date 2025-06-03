import React, { useState } from 'react';
import {
  MessageCircle,
  MessagesSquare,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Upload, CheckSquare, PlusSquare,
} from 'lucide-react';
import classes from './SideFunnel.module.scss';
import { useAppSelector } from 'shared/hooks/useAppSelector';
import { assignTrackerToOrder, getFunnelData } from 'shared/store/slices/funnelSlice';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { getUserIdFromToken } from 'shared/utils/cookies';

interface SideFunnelProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  orderId: string;
}

const ExpandableText: React.FC<{ text: string; maxLength?: number }> = ({
  text,
  maxLength = 100,
}) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > maxLength;

  const toggleExpanded = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  return (
    <div className={classes.expandableBlock}>
      <p className={classes.expandableText}>
        {expanded || !isLong ? text : `${text.slice(0, maxLength)}... `}
        {isLong && (
          <button className={classes.toggleLink} onClick={toggleExpanded} type="button">
            {expanded ? 'Скрыть' : 'Дальше'}
          </button>
        )}
      </p>
    </div>
  );
};

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'Не указано';
  try {
    return new Date(dateStr).toLocaleDateString('ru-RU');
  } catch {
    return 'Неверная дата';
  }
};
const SideFunnel: React.FC<SideFunnelProps> = ({ isOpen, toggleSidebar, orderId }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [isSubtasksOpen, setIsSubtasksOpen] = useState(true);

  const orders = useAppSelector(state => state.funnel.funnel);
const order = orders.find(o => o.id.toString() === orderId);
const userId = getUserIdFromToken();

const dispatch = useAppDispatch();

const handleBecomeTracker = async () => {
  if (!orderId || !userId) return;
console.log('CLICK — хочу стать трекером');
  await dispatch(assignTrackerToOrder({ orderId, trackerId: userId }));
  await dispatch(getFunnelData()); 
  toggleSidebar(); 
};

  if (!order) return null;
console.log('orderId:', orderId);
console.log('currentUser:', userId);

  return (
    <div className={`${classes.sidebarContainer} ${isOpen ? classes.containerOpen : ''}`}>
      <div className={`${classes.sidebar} ${isOpen ? classes.open : ''}`}>
        <button className={classes.toggleButton} onClick={toggleSidebar}>
          {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div className={classes.contentWrapper}>
          <div className={classes.content}>
            {/* HEADER */}
            <header className={classes.header}>
              <div className={classes.bloks}>
                <div className={classes.user_img} />
                <div className={classes.user_name}>
                  <p>Иван Соколов</p>
                  <p>ООО "Ratter"</p>
                </div>
                <div className={classes.chats}>
                  <MessageCircle size={18} className={classes.icon} />
                  <MessagesSquare size={18} className={classes.icon} />
                </div>
              </div>
            </header>

            {/* TITLE */}
            <div className={classes.title}>Название Заявки</div>

            {/* DEADLINES */}
            <div className={classes.time_block}>
              <div className={classes.project_name}>
                <p>Дедлайн статуса</p>
                <div className={classes.fidback}>
                  <Calendar size={14} className={classes.icon} />
                  <p>{formatDate(order.project_deadline)}</p>
                </div>
              </div>
              <div className={classes.project_name}>
                <p>Начало статуса</p>
                <div className={classes.fidback}>
                  <Calendar size={14} className={classes.icon} />
                  <p>12.02.2025</p>
                </div>
              </div>
              <div className={classes.project_name}>
                <p>Последний контакт с заказчиком</p>
                <div className={classes.fidback}>
                  <Calendar size={14} className={classes.icon} />
                  <p>{formatDate(order.updated_at)}</p>
                </div>
              </div>
              <div className={classes.project_name}>
                <p>Создано</p>
                <div className={classes.fidback}>
                  <Clock size={14} className={classes.icon} />
                  <p>{formatDate(order.created_at)}</p>
                </div>
              </div>
            </div>

            {/* INFO */}
            <div className={classes.title}>
              Информация по заявке
              <span
                className={`${classes.arrow} ${isInfoOpen ? classes.up : ''}`}
                onClick={() => setIsInfoOpen(prev => !prev)}
              />
            </div>
            {isInfoOpen && (
              <div className={classes.funnelInfo}>
                <div className={classes.sum}>
                  <p>Бюджет</p>
                  <span>{order.estimated_budget || '—'}</span>
                </div>
                <div className={classes.sum}>
                  <p>Трекер</p>
                  <span>-</span>
                </div>
              </div>
            )}

            {/* NOTE */}
            <div className={classes.blok_paragraph}>
              <h3>Заметка по заявке</h3>
              <div className={classes.paragraph}>
                <p>{order.extra_wishes || 'Комментариев нет'}</p>
              </div>
            </div>

            {/* SUBTASKS */}
            <div className={classes.subtasksWrapper}>
              <div
                className={classes.subtasksHeader}
                onClick={() => setIsSubtasksOpen(prev => !prev)}
              >
                <h3>Подзадачи</h3>
                <span className={`${classes.arrow} ${isSubtasksOpen ? classes.up : ''}`} />
              </div>

              {isSubtasksOpen && (
                <div className={classes.subtasksContent}>
                  <div className={classes.check_block}>
                    <CheckSquare size={14} className={classes.icon} />
                    <p>Прислать счёт об оплате</p>
                  </div>
                  <div className={classes.plus_block}>
                    <PlusSquare size={14} className={classes.icon} />
                    <p>Новая задача</p>
                  </div>
                </div>
              )}
            </div>

            {/* BUTTON */}
            <button className={classes.submitButton} onClick={handleBecomeTracker}>
  Стать трекером
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SideFunnel;