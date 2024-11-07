import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Example: Fetch notifications from an API
    const fetchNotifications = async () => {
      // Replace with your actual API call
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="relative">
      <button className="relative inline-flex items-center p-2 rounded-full text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none transition duration-200 ease-in-out z-10">
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-400"></span>
        )}
      </button>
      {notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <li key={notification.id} className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{notification.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;
