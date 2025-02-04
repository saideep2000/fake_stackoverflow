import { useState, useEffect, useCallback } from 'react';
import { Notification, User } from '../types';
import {
  acceptNotification,
  addNotification,
  clearNotification,
  getNotificationById,
} from '../services/notificationService';
import { getUserByUsername } from '../services/userService';
import useUserContext from './useUserContext';

const useUserProfileNotifications = () => {
  const { user, socket } = useUserContext();
  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
  const [errText, setErrText] = useState<string>('');

  const fetchNotifications = useCallback(async () => {
    if (user?.username) {
      try {
        const updatedUser = await getUserByUsername(user.username);
        if (updatedUser?.notifications) {
          const notificationData = await Promise.all(
            updatedUser.notifications.map((notificationId: Notification) =>
              getNotificationById(notificationId),
            ),
          );
          setUserNotifications(notificationData);
        }
      } catch (error) {
        setErrText('An error occurred while fetching the data');
        setUserNotifications([]);
      }
    }
  }, [user?.username]);

  useEffect(() => {
    fetchNotifications();

    const handleClearNotificationSocket = ({ nid }: { user: User; nid: string }) => {
      setUserNotifications(prev => prev.filter(notif => notif._id !== nid));
    };

    const handleNewNotifications = ({ notification }: { notification: Notification }) => {
      if (notification.receiver === user?.username) {
        setUserNotifications(prev => [notification, ...prev]);
      }
    };

    socket.on('notificationUpdate', handleNewNotifications);
    socket.on('clearNotification', handleClearNotificationSocket);

    return () => {
      socket.off('notificationUpdate', handleNewNotifications);
      socket.off('clearNotification', handleClearNotificationSocket);
    };
  }, [user, socket, fetchNotifications]);

  const handleClearNotification = async (notification: Notification) => {
    try {
      const userData = await getUserByUsername(user?.username);
      await clearNotification(userData._id, notification);
    } catch (error) {
      setErrText('An error occurred while fetching the data');
    }
  };

  const postNotification = async (notif: Notification) => {
    try {
      const notification: Notification = {
        sender: user.username,
        receiver: notif.sender,
        type: 'accept',
      };
      const senderUser = await getUserByUsername(notif.sender);
      await addNotification(senderUser._id, notification);
    } catch (error) {
      setErrText('An error occurred while fetching the data');
    }
  };

  const handleAcceptNotification = async (notification: Notification) => {
    try {
      const userData = await getUserByUsername(user.username);
      await acceptNotification(userData._id, notification);
      await handleClearNotification(notification);
      await postNotification(notification);
    } catch (error) {
      setErrText('An error occurred while fetching the data');
    }
  };

  return {
    errText,
    userNotifications,
    handleClearNotification,
    handleAcceptNotification,
  };
};

export default useUserProfileNotifications;
