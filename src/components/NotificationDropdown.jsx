import React, { useState, useEffect } from 'react';
import { 
  CheckIcon, 
  TrashIcon, 
  EyeIcon, 
  XMarkIcon,
  BellIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useNotification } from '../contexts/NotificationContext';

const NotificationDropdown = ({ onClose }) => {
  const {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead
  } = useNotification();

  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadNotifications(page, { type: filter === 'all' ? '' : filter });
  }, [page, filter, loadNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDelete = async (notificationId) => {
    await deleteNotification(notificationId);
  };

  const handleDeleteAllRead = async () => {
    await deleteAllRead();
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'high':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'low':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type) => {
    const typeLabels = {
      'application_status': 'Trạng thái ứng tuyển',
      'job_match': 'Công việc phù hợp',
      'deadline_reminder': 'Nhắc nhở deadline',
      'profile_viewed': 'Hồ sơ được xem',
      'new_applicant': 'Ứng viên mới',
      'job_expiring': 'Công việc sắp hết hạn',
      'weekly_stats': 'Thống kê tuần',
      'monthly_stats': 'Thống kê tháng',
      'company_interest': 'Ứng viên quan tâm',
      'system': 'Hệ thống',
      'reminder': 'Nhắc nhở'
    };
    return typeLabels[type] || type;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Thông báo {unreadCount > 0 && `(${unreadCount})`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Filter Tabs */}
        <div className="mt-3 flex space-x-1">
          {['all', 'application_status', 'job_match', 'new_applicant', 'system'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filter === filterType
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterType === 'all' ? 'Tất cả' : getTypeLabel(filterType)}
            </button>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="mt-3 flex space-x-2">
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center space-x-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
          >
            <CheckIcon className="h-4 w-4" />
            <span>Đánh dấu tất cả đã đọc</span>
          </button>
          
          <button
            onClick={handleDeleteAllRead}
            className="flex items-center space-x-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Xóa đã đọc</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Đang tải...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <BellIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p>Không có thông báo nào</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                !notification.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Priority Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getPriorityIcon(notification.priority)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${
                      !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {notification.title}
                    </h4>
                    
                    <div className="flex items-center space-x-1">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-gray-400 hover:text-green-600 transition-colors"
                          title="Đánh dấu đã đọc"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Xóa thông báo"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {getTypeLabel(notification.type)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                  
                  {/* Action URL */}
                  {notification.data?.actionUrl && (
                    <div className="mt-2">
                      <a
                        href={notification.data.actionUrl}
                        className="text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        Xem chi tiết →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => setPage(page + 1)}
            disabled={!hasMore || loading}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang tải...' : hasMore ? 'Xem thêm' : 'Đã hết'}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;



