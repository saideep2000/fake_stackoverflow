import { User } from '../types';
import api from './config';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Function to handle the login request.
 *
 * @param username - The username entered by the user.
 * @param password - The password entered by the user.
 * @returns The API response containing the logged-in user's data.
 * @throws Error if login fails.
 */
const loginUser = async (username: string, password: string) => {
  const res = await api.post(`${USER_API_URL}/login`, { username, password });

  if (res.status !== 200) {
    throw new Error('Login failed');
  }

  return res;
};

/**
 * Function to handle the create account request.
 *
 * @param name - The name entered by the user.
 * @param username - The username entered by the user.
 * @param password - The password entered by the user.
 * @param email - The email entered by the user.
 * @param pronouns - The pronouns entered by the user.
 * @returns The API response containing the newly created user's data.
 * @throws Error if account creation fails.
 */

const createUser = async (
  username: string,
  password: string,
  name: string,
  email: string,
  pronouns: string,
  image: string,
  friends: string[],
  notifications: Notification[],
) => {
  const res = await api.post(`${USER_API_URL}/addUser`, {
    username,
    password,
    name,
    email,
    pronouns,
    image,
    friends,
    notifications,
  });

  if (res.status !== 200) {
    throw new Error('Account creation failed');
  }

  return res;
};

/**
 * Function to remove a friend from friends list and remove current users name from that friends list.
 *
 * @param user - The user removing a friend.
 * @param friend - The user being removed.
 * @throws Error if there is an issue removing a friend.
 */
const removeFriend = async (user: User, friend: User) => {
  const data = { user, friend };
  const res = await api.post(`${USER_API_URL}/removeFriend`, data);
  if (res.status !== 200) {
    throw new Error('Error while removing a friend');
  }
  return res.data;
};

/**
 * Function to get a user by their username.
 *
 * @param username - The username of the user to retrieve.
 * @throws Error if there is an issue fetching the user by username.
 */
const getUserByUsername = async (username: string): Promise<User> => {
  const res = await api.get(`${USER_API_URL}/getUserByUsername/${username}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching question by id');
  }
  return res.data;
};

/**
 * Function to update the user in the database.
 *
 * @param id - The id of the user to update.
 * @param user - The updated user object.
 * @throws Error if there is an issue updating the user.
 */
const updateUser = async (username: string, updatedUser: User) => {
  const data = { username, updatedUser };
  const res = await api.put(`${USER_API_URL}/updateUser`, data);
  if (res.status !== 200) {
    throw new Error('Error when updating user');
  }
  return res.data;
};

export { loginUser, createUser, removeFriend, getUserByUsername, updateUser };
