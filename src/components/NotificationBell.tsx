import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState(5); // Initially show 5 notifications

  // Load notifications from localStorage on component mount
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications'));
    if (storedNotifications) {
      setNotifications(storedNotifications);
    } else {
      setNotifications([
        { id: 1, message: 'New lead assigned to you', time: '5 minutes ago', isRead: false },
        { id: 2, message: 'Appointment reminder: Property viewing at 2 PM', time: '1 hour ago', isRead: false },
        { id: 3, message: 'Listing price updated for 123 Main St', time: '2 hours ago', isRead: true },
        { id: 4, message: 'Offer received for 456 Oak St', time: '3 hours ago', isRead: false },
        { id: 5, message: 'New client inquiry', time: '4 hours ago', isRead: false },
        { id: 6, message: 'Property sold: 789 Pine St', time: '5 hours ago', isRead: true },
        { id: 7, message: 'New lead: Jane Doe', time: '6 hours ago', isRead: false },
        { id: 8, message: 'Offer received for 987 Birch St', time: '7 hours ago', isRead: false },
        { id: 9, message: 'Client feedback for 234 Maple St', time: '8 hours ago', isRead: true },
        { id: 10, message: 'Listing removed for 543 Cedar St', time: '9 hours ago', isRead: false },
      ]);
    }
  }, []);

  // Save notifications to localStorage whenever they are updated
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const clearNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Load more notifications when user scrolls near the bottom
  const loadMoreNotifications = () => {
    if (visibleNotifications < notifications.length) {
      setVisibleNotifications(visibleNotifications + 5); // Load 5 more notifications
    }
  };

  // Detect when user scrolls near the bottom of the list
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadMoreNotifications();
    }
  };

  return (
    <div className="relative">
      <button
        className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors duration-200"
        onClick={toggleNotifications}
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 border border-gray-700">
          <div className="py-2">
            <h3 className="text-sm font-medium text-gray-100 px-4 py-2 border-b border-gray-700">Notifications</h3>
            <div className="mt-2 max-h-72 overflow-y-auto" onScroll={handleScroll}>
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-400 px-4 py-2">No new notifications</p>
              ) : (
                notifications.slice(0, visibleNotifications).map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-2 hover:bg-gray-