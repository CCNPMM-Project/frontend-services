import api from './api';

const notificationService = {
  /**
   * Lấy danh sách thông báo với phân trang và filter
   */
  async getNotifications(page = 1, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...filters
      });

      const response = await api.get(`/notifications?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Lấy thông báo theo ID
   */
  async getNotificationById(notificationId) {
    try {
      const response = await api.get(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw error;
    }
  },

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  async getUnreadCount() {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  /**
   * Lấy thống kê thông báo
   */
  async getStats() {
    try {
      const response = await api.get('/notifications/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      throw error;
    }
  },

  /**
   * Đánh dấu thông báo đã đọc
   */
  async markAsRead(notificationId) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  async markAllAsRead() {
    try {
      const response = await api.put('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Xóa thông báo
   */
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Xóa tất cả thông báo đã đọc
   */
  async deleteAllRead() {
    try {
      const response = await api.delete('/notifications/read/delete-all');
      return response.data;
    } catch (error) {
      console.error('Error deleting all read notifications:', error);
      throw error;
    }
  },

  /**
   * Gửi thông báo (chỉ admin)
   */
  async sendNotification(notificationData) {
    try {
      const response = await api.post('/notifications/send', notificationData);
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  },

  /**
   * Gửi thông báo hàng loạt (chỉ admin)
   */
  async sendBulkNotification(notificationData) {
    try {
      const response = await api.post('/notifications/send-bulk', notificationData);
      return response.data;
    } catch (error) {
      console.error('Error sending bulk notification:', error);
      throw error;
    }
  }
};

export default notificationService;