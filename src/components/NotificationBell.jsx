import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useNotification } from '../contexts/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Try to get notification context, fallback if not available
  let unreadCount = 0;
  let isConnected = false;

  try {
    const notificationContext = useNotification();
    unreadCount = notificationContext.unreadCount;
    isConnected = notificationContext.isConnected;
  } catch (error) {
    console.warn('NotificationContext not available:', error.message);
  }

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-white hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
        aria-label="Thông báo"
      >
        <BellIcon className="h-6 w-6" />

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Connection Status Indicator */}
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} title={isConnected ? 'Đã kết nối' : 'Mất kết nối'} />
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <NotificationDropdown onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default NotificationBell;