import express, { Response } from 'express';
import {
  User,
  AddUserRequest,
  LoginRequest,
  FakeSOSocket,
  RemoveFriendRequest,
  FindUserByUsernameRequest,
  UserResponse,
  UpdateUserRequest,
} from '../types';
import { populateDocument, removeFriends, saveUser } from '../models/application';
import UserModel from '../models/users';
import NotificationModel from '../models/notification';

const userController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided user request contains the required fields.
   * @param req The request object containing the user data.
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddUserRequest): boolean =>
    !!req.body.username &&
    !!req.body.password &&
    !!req.body.name &&
    !!req.body.email &&
    !!req.body.pronouns &&
    !!req.body.image &&
    req.body.friends !== undefined &&
    req.body.notifications !== undefined;

  /**
   * Validates the user object to ensure it contains all the necessary fields.
   * @param user The user object to validate.
   * @returns `true` if the user is valid, otherwise `false`.
   */
  const isUserValid = (user: User): boolean =>
    user.username !== undefined &&
    user.username !== '' &&
    user.password !== undefined &&
    user.password !== '' &&
    user.name !== undefined &&
    user.name !== '' &&
    user.email !== undefined &&
    user.email !== '' &&
    user.pronouns !== undefined &&
    user.pronouns !== '' &&
    user.image !== undefined &&
    user.friends !== undefined &&
    user.notifications !== undefined;

  /**
   * Checks if the provided username and email are unique, i.e., do not already exist in the database.
   *
   * @param username - The username to check for uniqueness.
   * @param email - The email to check for uniqueness.
   * @returns A `string` error message if either the username or email already exists.
   *          If both are unique, returns `null`.
   */
  const isUsernameAndEmailUnique = async (
    username: string,
    email: string,
  ): Promise<string | null> => {
    const userByUsername = await UserModel.findOne({ username });
    if (userByUsername) {
      return 'Username already exists.';
    }

    const userByEmail = await UserModel.findOne({ email });
    if (userByEmail) {
      return 'Email is already in use.';
    }

    return null;
  };

  /**
   * Adds a new user to the database. The user is first validated and then saved.
   * If the user is invalid or saving fails, the HTTP response status is updated.
   *
   * @param req the AddUserRequest object containing the user data.
   * @param res the HTTP response object used to send back the result of the operation.
   *
   * @returns a Promise that resolves to void.
   */
  const addUserRoute = async (req: AddUserRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    if (!isUserValid(req.body)) {
      res.status(400).send('Invalid user');
      return;
    }

    const uniquenessError = await isUsernameAndEmailUnique(req.body.username, req.body.email);
    if (uniquenessError) {
      res.status(400).send(uniquenessError);
      return;
    }

    const user = req.body;
    try {
      const result = await saveUser(user);
      if ('error' in result) {
        throw new Error(result.error);
      }
      const populatedUser = await populateDocument(result._id?.toString(), 'user');
      if (populatedUser && 'error' in populatedUser) {
        throw new Error(populatedUser.error);
      }
      socket.emit('userUpdate', populatedUser as User);
      res.json({
        success: true,
        message: 'User created successfully',
        user: {
          username: result.username,
          password: result.password,
          name: result.name,
          email: result.email,
          pronouns: result.pronouns,
          image: result.image,
          friends: result.friends,
          notifications: result.notifications,
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving user: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving user`);
      }
    }
  };

  /**
   * Handles the login request. Checks if the username exists and if the password matches.
   * @param req The request object containing the login data.
   * @param res The response object to send the result.
   */
  const loginUserRoute = async (req: LoginRequest, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).send('Username and password are required');
      return;
    }

    try {
      // Check if the user exists with the provided username
      const user = await UserModel.findOne({ username });

      if (!user) {
        res.status(400).json({ success: false, message: 'Invalid username or password' });
        return;
      }
      if (username !== user.username) {
        res.status(400).json({ success: false, message: 'Invalid username or password' });
        return;
      }

      // Compare the entered password with the stored password
      if (password !== user.password) {
        res.status(400).json({ success: false, message: 'Invalid username or password' });
        return;
      }

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          username: user.username,
          password: user.password,
          name: user.name,
          email: user.email,
          pronouns: user.pronouns,
          image: user.image,
          friends: user.friends,
          notifications: user.notifications,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
  };

  /**
   * Updates the profile picture of a user from a file upload
   * @param req The request object containing the username and the image file
   * @param res The response object to send the result of the function
   */

  /**
   * Handles removing a friend. The request must contain the user ID (uid) and the friend (user).
   * If the request is invalid or an error occurs, the appropriate HTTP response status and message are returned.
   *
   * @param req The RemoveFriendRequest object containing the user ID and the user.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const removeFriend = async (req: RemoveFriendRequest, res: Response): Promise<void> => {
    const { user, friend } = req.body;

    if (!user || !friend) {
      res.status(400).send('Missing user ID or friend (user)');
      return;
    }

    try {
      const current = (await UserModel.findOne({ username: user.username })) as User;

      if (!current) {
        res.status(400).send('User not found');
        return;
      }

      const friendToRemove = (await UserModel.findOne({ _id: friend._id })) as User;

      if (!friendToRemove) {
        res.status(400).send('Friend not found');
        return;
      }

      const status = await removeFriends(current, friendToRemove);

      if (status && 'error' in status) {
        throw new Error(status.error as string);
      }

      // Populates the fields of the answer that was added and emits the new object
      socket.emit('removeFriend', {
        user: current as UserResponse,
        friend: friendToRemove as UserResponse,
      });

      socket.emit('removeFriend', {
        user: friendToRemove as UserResponse,
        friend: user as UserResponse,
      });

      res.status(200).json({ msg: 'Friend removed successfully' });
    } catch (err) {
      res.status(500).send(`Error when removing friend: ${(err as Error).message}`);
    }
  };

  /**
   * Retrieves a user by their unique username.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindUserByUsernameRequest object containing the username as a parameter.
   * @param res The HTTP response object used to send back the question details.
   *
   * @returns A Promise that resolves to void.
   */
  const getUserByUsername = async (
    req: FindUserByUsernameRequest,
    res: Response,
  ): Promise<void> => {
    const { username } = req.params;

    if (username === undefined) {
      res.status(400).send('Invalid username request.');
      return;
    }

    try {
      const u = await UserModel.findOne({ username }).populate([
        { path: 'friends' },
        {
          path: 'notifications',
          model: NotificationModel,
        },
      ]);

      if (u && !('error' in u)) {
        res.json(u);
        return;
      }

      throw new Error('Error while fetching user by username');
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error while fetching user by username: ${err.message}`);
      } else {
        res.status(500).send(`Error while fetching user by username`);
      }
    }
  };

  /**
   * Updates the users information in the database.
   *
   * @param req - The request object containing the username and the updated user information.
   * @param res - The response object used to send back the result of the operation.
   * @returns A Promise that resolves to void.
   */

  const updateUser = async (req: UpdateUserRequest, res: Response): Promise<void> => {
    const { username, updatedUser } = req.body;

    if (!username || !updatedUser) {
      res.status(400).send('Missing username or updated user');
      return;
    }

    try {
      const user = await UserModel.findOneAndUpdate({ username }, updatedUser);

      if (!user) {
        res.status(400).send('User not found');
        return;
      }

      res.status(200).send('User updated successfully');
    } catch (err) {
      res.status(500).send('Error while updating user');
    }
  };

  router.post('/addUser', addUserRoute);
  router.post('/login', loginUserRoute);
  router.post('/removeFriend', removeFriend);
  router.get('/getUserByUsername/:username', getUserByUsername);
  router.put('/updateUser', updateUser);

  return router;
};

export default userController;
