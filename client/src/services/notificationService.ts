import { Notification } from '../types';
import api from './config';

const NOTIFICATION_API_URL = `${process.env.REACT_APP_SERVER_URL}/notification`;

/**
 * Sends a new notification to a specific user.
 *
 * @param uid - The id of the user to which the notification is being sent.
 * @param noti - The notification object containing the notification details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const addNotification = async (uid: string, noti: Notification): Promise<Notification> => {
  const data = { uid, noti };
  const res = await api.post(`${NOTIFICATION_API_URL}/addNotification`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new notification');
  }
  return res.data;
};

/**
 * Function to clear (decline) a notification.
 *
 * @param uid - The ID of the user to clear notification from.
 * @param noti - The notification being cleared.
 * @throws Error if there is an issue clearing the notification.
 */
const clearNotification = async (uid: string, noti: Notification) => {
  const data = { uid, noti };
  const res = await api.post(`${NOTIFICATION_API_URL}/clearNotification`, data);
  if (res.status !== 200) {
    throw new Error('Error while clearing the notification');
  }
  return res.data;
};

/**
 * Function to accept a notification.
 *
 * @param uid - The ID of the user accepting the notification.
 * @param noti - The notification being accepted.
 * @throws Error if there is an issue accepting a notification.
 */
const acceptNotification = async (uid: string, noti: Notification) => {
  const data = { uid, noti };
  const res = await api.post(`${NOTIFICATION_API_URL}/acceptNotification`, data);
  if (res.status !== 200) {
    throw new Error('Error while accepting the notification');
  }
  return res.data;
};

/**
 * Function to get a user by their username.
 *
 * @param nid - The id of the notification to retrieve.
 * @throws Error if there is an issue fetching the user by username.
 */
const getNotificationById = async (nid: Notification): Promise<Notification> => {
  const res = await api.get(`${NOTIFICATION_API_URL}/getNotificationById/${nid._id}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching notification by id');
  }
  return res.data;
};

export { addNotification, clearNotification, acceptNotification, getNotificationById };
