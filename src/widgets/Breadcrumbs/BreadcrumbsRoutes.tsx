import { RouteObject } from "react-router-dom";
import { BreadcrumbsRoute } from 'use-react-router-breadcrumbs';
// Пример с динамическим отображением




export const routes: BreadcrumbsRoute[] = [
  { path: "/", breadcrumb: "Вход" },
  { path: "/create-account", breadcrumb: "Создание аккаунта" },
  { path: "/steps", breadcrumb: "Первичные шаги" },
  { path: "/manager", breadcrumb: "Главная" },
  { path: "/manager/tasks", breadcrumb: "Задачи" },
  { path: "/manager/specialists", breadcrumb: "Специалисты" },
  {
    path: "/manager/specialists/:id",
    breadcrumb: () => <span>Профиль специалиста</span>,
  },
  { path: "/manager/clients", breadcrumb: "Клиенты" },
  {
    path: "/manager/clients/:id",
    breadcrumb: ({ match }) => <span>Клиент #{match.params.id}</span>,
  },
  { path: "/manager/project/:id", breadcrumb: "Проект" },
  { path: "/manager/user_projects", breadcrumb: "Проекты" },
  { path: "/manager/settings", breadcrumb: "Настройки" },
  { path: "/manager/chats", breadcrumb: "Чаты" },
  { path: "/manager/overview", breadcrumb: "Сводка" },
  { path: "/manager/overview/gantt", breadcrumb: "Гант" },
  { path: "/manager/overview/kanban", breadcrumb: "Канбан" },
  { path: "/manager/business-application", breadcrumb: "Заявка бизнеса" },
];
