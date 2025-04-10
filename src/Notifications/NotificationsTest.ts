// NotificationsTest.ts
import { useEffect } from 'react';
import { getCookie } from 'shared/utils/cookies';

const useNotificationSocket = (onMessage: (data: any) => void) => {
  useEffect(() => {
    const token = getCookie("access_token");
    
  const ws = new WebSocket(`ws://${window.location.hostname}:8000/ws/notifications/?token=${token}`);


    ws.onopen = () => {
      console.log('🔌 WebSocket подключён');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('🔔 Новое уведомление:', data);
      onMessage(data); 
    };

    ws.onclose = () => {
      console.log('❌ WebSocket отключён');
    };

    ws.onerror = (error) => {
      console.error('Ошибка WebSocket:', error);
    };

    return () => {
      ws.close();
    };
  }, [onMessage]);
};

export default useNotificationSocket;
