import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Notification collection.
 *
 * This schema defines the structure for storing notifications in the database.
 * Each notification includes the following fields:
 * - `sender`: The username of the user who sent the notification.
 * - `receiver`: The username of the user who received the notification.
 * - `type`: The type of the notification.
 */

const notificationSchema: Schema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { collection: 'Notification' },
);

export default notificationSchema;
