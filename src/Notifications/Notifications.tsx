import React, { useEffect, useState } from "react";
import useNotificationSocket from "./NotificationsTest";
import { getNotifications } from "shared/api/notifications";

interface Notification {
  id: number;
  message: string;
  type_display: string;
  status_display: string;
  created_at: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNotifications();
      setNotifications(data);
    };

    fetchData();
  }, []);

  useNotificationSocket((data: { message: string }) => {
    const newNotification: Notification = {
      id: Date.now(), // временный ID
      message: data.message,
      type_display: "Новое",
      status_display: "Не прочитано",
      created_at: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
  });

  return (
    <div>
      <h2>🔔 Уведомления</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            <strong>{n.type_display}</strong>: {n.message} <br />
            <small>{new Date(n.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
