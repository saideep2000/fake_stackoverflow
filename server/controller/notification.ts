import express, { Response } from 'express';
import {
  Notification,
  NotificationRequest,
  FakeSOSocket,
  NotificationResponse,
  FindNotificationByIdRequest,
  UserResponse,
} from '../types';
import {
  addFriends,
  addNotificationToUser,
  saveNotification,
  populateDocument,
} from '../models/application';
import NotificationModel from '../models/notification';
import UserModel from '../models/users';

const notificationController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided notification request contains the required fields.
   *
   * @param req The request object containing the notification data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isRequestValid(req: NotificationRequest): boolean {
    return !!req.body.uid && !!req.body.noti;
  }

  /**
   * Checks if the provided notification contains the required fields.
   *
   * @param noti The notification object to validate.
   *
   * @returns `true` if the notification is valid, otherwise `false`.
   */
  function isNotificationValid(noti: Notification): boolean {
    return !!noti.sender && !!noti.receiver && !!noti.type;
  }

  /**
   * Adds a new notification to a user in the database. The notification request and notification are
   * validated and then saved. If successful, the notification is associated with the corresponding
   * user. If there is an error, the HTTP response's status is updated.
   *
   * @param req The NotificationRequest object containing the user ID and notification data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addNotification = async (req: NotificationRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    if (!isNotificationValid(req.body.noti)) {
      res.status(400).send('Invalid notification');
      return;
    }

    const { uid } = req.body;
    const notiInfo: Notification = req.body.noti;

    try {
      const notiFromDb = await saveNotification(notiInfo);

      if ('error' in notiFromDb) {
        throw new Error(notiFromDb.error as string);
      }

      const status = await addNotificationToUser(uid, notiFromDb);

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      const populatedNoti = (await NotificationModel.findOne({
        _id: notiFromDb._id,
      })) as NotificationResponse;

      if (populatedNoti && 'error' in populatedNoti) {
        throw new Error(populatedNoti.error as string);
      }

      // Populates the fields of the notification that was added and emits the new object
      socket.emit('notificationUpdate', {
        uid,
        notification: populatedNoti as NotificationResponse,
      });

      res.json(notiFromDb);
    } catch (err) {
      res.status(500).send(`Error when adding notification: ${(err as Error).message}`);
    }
  };

  /**
   * Handles clearing a notification. The request must contain the user ID (uid) and the notification.
   * If the request is invalid or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The NotificationRequest object containing the user ID and the notification.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const clearNotification = async (req: NotificationRequest, res: Response): Promise<void> => {
    const { uid, noti } = req.body;

    if (!uid || !noti) {
      res.status(400).send('Missing user ID or notification');
      return;
    }

    try {
      const user = await UserModel.findById(uid);

      if (!user) {
        res.status(400).send('User not found');
        return;
      }
      if (user) {
        user.notifications = user.notifications.filter(
          nid => nid.toString() !== noti._id.toString(),
        );
        await user.save();
      } else {
        res.status(400).send('Notification or user not found, or invalid notification ID.');
      }

      socket.emit('clearNotification', {
        user,
        nid: noti._id.toString(),
      });

      res.status(200).json({ msg: 'Notification cleared successfully' });
    } catch (err) {
      res.status(500).send(`Error when clearing notification: ${(err as Error).message}`);
    }
  };

  /**
   * Handles accepting a notification. The request must contain the user ID (uid) and the notification.
   * If the request is invalid or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The NotificationRequest object containing the user ID and the notification.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const acceptNotification = async (req: NotificationRequest, res: Response): Promise<void> => {
    const { uid, noti } = req.body;

    if (!uid || !noti) {
      res.status(400).send('Missing user ID or notification');
      return;
    }

    try {
      // Now process the acceptance of the notification
      const receivingUser = await UserModel.findOne({ username: noti.receiver });
      if (!receivingUser) {
        res.status(400).send('Receiving user not found');
        return;
      }

      const sendingUser = await UserModel.findOne({ username: noti.sender });

      if (!sendingUser) {
        res.status(400).send('Sending user not found');
        return;
      }
      const populatedFriend = await populateDocument(receivingUser.id, 'user');
      if (populatedFriend && 'error' in populatedFriend) {
        throw new Error(populatedFriend.error as string);
      }

      const status = await addFriends(sendingUser, receivingUser);

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      socket.emit('addFriend', {
        user: receivingUser as UserResponse,
        friend: sendingUser as UserResponse,
      });

      res.status(200).json({
        msg: 'Notification accepted and cleared successfully, and friend added successfully',
      });
    } catch (err) {
      res.status(500).send(`Error when clearing notification: ${(err as Error).message}`);
    }
  };

  /**
   * Retrieves a notification by its unique ID.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindQuestionByIdRequest object containing the notification ID as a parameter.
   * @param res The HTTP response object used to send back the question details.
   *
   * @returns A Promise that resolves to void.
   */
  const getNotificationById = async (
    req: FindNotificationByIdRequest,
    res: Response,
  ): Promise<void> => {
    const { nid } = req.params;

    if (nid === undefined) {
      res.status(400).send('Invalid Notification Request');
      return;
    }

    try {
      const n = await NotificationModel.findOne({ _id: nid });

      if (n && !('error' in n)) {
        res.json(n);
        return;
      }

      throw new Error('Error while fetching notification by id');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error while fetching notification by id: ${err.message}`);
      } else {
        res.status(500).send(`Error while fetching notification by id`);
      }
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/addNotification', addNotification);
  router.post('/clearNotification', clearNotification);
  router.post('/acceptNotification', acceptNotification);
  router.get('/getNotificationById/:nid', getNotificationById);

  return router;
};

export default notificationController;
