import api from "./api";

export const getNotifications = (page = 1, limit = 20) => 
  api.get("/notifications", { params: { page, limit } });

export const getUnreadCount = () => 
  api.get("/notifications/unread-count");

export const markAsRead = (notificationId) => 
  api.put(`/notifications/${notificationId}/read`);

export const markAllAsRead = () => 
  api.put("/notifications/mark-all-read");

export const deleteNotification = (notificationId) => 
  api.delete(`/notifications/${notificationId}`);
