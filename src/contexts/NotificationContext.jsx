import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Khởi tạo Socket.io connection
  useEffect(() => {
    if (!user || !token) {
      setIsConnected(false);
      return;
    }

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:8080', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('🔌 Connected to notification server');
      setIsConnected(true);
      setError(null);
      // Reload notifications when reconnected
      loadNotifications();
      loadUnreadCount();
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from notification server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setError('Không thể kết nối đến server thông báo');
      setIsConnected(false);
    });

    // Lắng nghe thông báo mới
    newSocket.on('new_notification', (notification) => {
      console.log('📨 New notification received:', notification);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Hiển thị toast notification
      showToastNotification(notification);
    });

    // Lắng nghe cập nhật unread count
    newSocket.on('unread_count_update', (data) => {
      setUnreadCount(data.count);
    });

    // Join notifications room
    newSocket.emit('join_notifications');

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.emit('leave_notifications');
        newSocket.disconnect();
      }
    };
  }, [user, token]);

  // Load notifications khi user thay đổi
  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Load danh sách thông báo
  const loadNotifications = useCallback(async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(page, filters);
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }, []);

  // Đánh dấu thông báo đã đọc
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, isRead: true, readAt: new Date() }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Đánh dấu tất cả thông báo đã đọc
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, isRead: true, readAt: new Date() }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  // Xóa thông báo
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const response = await notificationService.deleteNotification(notificationId);
      if (response.success) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        // Giảm unread count nếu thông báo chưa đọc
        const notification = notifications.find(notif => notif.id === notificationId);
        if (notification && !notification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications]);

  // Xóa tất cả thông báo đã đọc
  const deleteAllRead = useCallback(async () => {
    try {
      const response = await notificationService.deleteAllRead();
      if (response.success) {
        setNotifications(prev => prev.filter(notif => !notif.isRead));
      }
    } catch (error) {
      console.error('Error deleting all read notifications:', error);
    }
  }, []);

  // Hiển thị toast notification
  const showToastNotification = useCallback((notification) => {
    // Tạo toast notification element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 max-w-sm bg-white border-l-4 ${
      notification.priority === 'urgent' ? 'border-red-500' :
      notification.priority === 'high' ? 'border-orange-500' :
      notification.priority === 'medium' ? 'border-blue-500' :
      'border-green-500'
    } shadow-lg rounded-lg p-4 transform translate-x-full transition-transform duration-300`;
    
    toast.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
        <div class="ml-3 flex-1">
          <h4 class="text-sm font-medium text-gray-900">${notification.title}</h4>
          <p class="text-sm text-gray-500 mt-1">${notification.message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }, 5000);
  }, []);

  // Refresh notifications
  const refreshNotifications = useCallback(() => {
    loadNotifications();
    loadUnreadCount();
  }, [loadNotifications, loadUnreadCount]);

  const value = {
    notifications,
    unreadCount,
    isConnected,
    loading,
    error,
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
