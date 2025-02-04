import { Schema } from 'mongoose';

/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure for storing users in the database.
 * Each user includes the following fields:
 * - `username`: The username of the user. This field is required.
 * - `password`: The password of the user. This field is required.
 * - `name`: The name of the user. This field is required.
 * - `email`: The email of the user. This field is required.
 * - `pronouns`: The pronouns of the user. This field is required.
 * - `image`: The image of the user. This field is required.
 * - `friends`: The friends of the user. This field is required.
 * - `notifications`: The notifications of the user. This field is required.
 */

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    pronouns: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    friends: {
      type: Array,
      required: true,
    },
    notifications: {
      type: Array,
      required: true,
    },
  },
  { collection: 'User' },
);

export default userSchema;
