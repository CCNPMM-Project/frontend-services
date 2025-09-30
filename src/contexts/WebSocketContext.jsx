import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        
        // Tạo WebSocket connection
        const ws = new WebSocket(`ws://localhost:8080/ws`);
        
        ws.onopen = () => {
          console.log('✅ Connected to WebSocket server');
          setIsConnected(true);
          
          // Send user info to join room
          ws.send(JSON.stringify({
            type: 'join',
            userId: parsedUser._id,
            token: token
          }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📨 WebSocket message received:', data);
            
            if (data.type === 'notification') {
              // Thêm thông báo mới vào danh sách
              setNotifications(prev => [data.notification, ...prev]);
              
              // Tăng số lượng chưa đọc
              setUnreadCount(prev => prev + 1);
              
              // Hiển thị thông báo toast (tùy chọn)
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(data.notification.type, {
                  body: data.notification.message,
                  icon: '/favicon.ico'
                });
              }
            } else if (data.type === 'unreadCount') {
              console.log('📊 Unread count updated:', data.count);
              setUnreadCount(data.count);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onclose = () => {
          console.log('🔌 WebSocket connection closed');
          setIsConnected(false);
        };

        ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          setIsConnected(false);
        };

        setSocket(ws);

        // Cleanup function
        return () => {
          if (ws) {
            ws.close();
          }
        };
      } catch (error) {
        console.error('Error connecting to WebSocket:', error);
      }
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const value = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    setNotifications,
    setUnreadCount
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};