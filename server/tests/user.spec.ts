import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { User } from '../types';
import UserModel from '../models/users';

describe('POST /addUser', () => {
  afterEach(async () => {
    jest.resetAllMocks();
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return 200 if user is successfully added', async () => {
    const newUser: User = {
      username: 'joemama',
      password: 'password',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: 'img',
      friends: [],
      notifications: [],
    };

    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(util, 'saveUser').mockResolvedValueOnce(newUser as User);
    jest.spyOn(util, 'populateDocument').mockResolvedValueOnce(newUser as User);

    const response = await supertest(app).post('/user/addUser').send(newUser);

    expect(response.status).toBe(200);
  });
  it('should return 400 if password is missing', async () => {
    const badUser = {
      username: 'joemama',
      password: '',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: 'img',
      friends: [],
      notifications: [],
    };

    const response = await supertest(app).post('/user/addUser').send(badUser);
    expect(response.status).toBe(400);
  });

  it('should return 400 if username is missing', async () => {
    const badUser = {
      username: '',
      password: 'password',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: 'img',
      friends: [],
      notifications: [],
    };

    const response = await supertest(app).post('/user/addUser').send(badUser);
    expect(response.status).toBe(400);
  });

  it('should return 400 if name is missing', async () => {
    const badUser = {
      username: 'joemama',
      password: 'password',
      name: '',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: 'img',
      friends: [],
      notifications: [],
    };

    const response = await supertest(app).post('/user/addUser').send(badUser);
    expect(response.status).toBe(400);
  });

  it('should return 400 if email is missing', async () => {
    const badUser = {
      username: 'joemama',
      password: 'password',
      name: 'Joe Mama',
      email: '',
      pronouns: 'he/him',
      image: 'img',
      friends: [],
      notifications: [],
    };

    const response = await supertest(app).post('/user/addUser').send(badUser);
    expect(response.status).toBe(400);
  });

  it('should return 400 if pronouns are missing', async () => {
    const badUser = {
      username: 'joemama',
      password: 'password',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: '',
      image: 'img',
      friends: [],
      notifications: [],
    };

    const response = await supertest(app).post('/user/addUser').send(badUser);
    expect(response.status).toBe(400);
  });

  it('should return 400 if image is missing', async () => {
    const badUser = {
      username: 'joemama',
      password: 'password',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: '',
      friends: [],
      notifications: [],
    };

    const response = await supertest(app).post('/user/addUser').send(badUser);
    expect(response.status).toBe(400);
  });

  it('should return 400 if user already exists', async () => {
    const newUser: User = {
      username: 'joemama',
      password: 'password',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: 'img',
      friends: [],
      notifications: [],
    };

    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(newUser as User);

    const response = await supertest(app).post('/user/addUser').send(newUser);
    expect(response.status).toBe(400);
  });

  test('should return 400 if the email is already in use', async () => {
    const newUser: User = {
      username: 'joemama',
      password: 'password',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: 'img',
      friends: [],
      notifications: [],
    };

    const anotherUser: User = {
      username: 'suemama',
      password: 'password',
      name: 'Sue Mama',
      email: 'joemama@gmail.com',
      pronouns: 'she/him',
      image: 'img',
      friends: [],
      notifications: [],
    };

    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(newUser as User);

    const response = await supertest(app).post('/user/addUser').send(anotherUser);
    expect(response.status).toBe(400);
  });

  test('should return 400 if the username is already in use', async () => {
    const newUser: User = {
      username: 'joemama',
      password: 'password',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: 'img',
      friends: [],
      notifications: [],
    };

    const anotherUser: User = {
      username: 'joemama',
      password: 'password',
      name: 'Sue Mama',
      email: 'suemama@gmail.com',
      pronouns: 'she/him',
      image: 'img',
      friends: [],
      notifications: [],
    };

    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(newUser as User);

    const response = await supertest(app).post('/user/addUser').send(anotherUser);
    expect(response.status).toBe(400);
  });

  test('should return 400 if the user in invalid', async () => {
    const badUser = {
      username: undefined,
      password: 'password',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: 'img',
      friends: [],
      notifications: [],
    };

    const response = await supertest(app).post('/user/addUser').send(badUser);
    expect(response.status).toBe(400);
  });
});

describe('POST /login', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return 200 if login is successful with correct credentials', async () => {
    const userJoe = {
      username: 'joemama',
      password: 'password',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: 'img',
      friends: [],
      notifications: [],
    };
    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(userJoe);

    const loginJoe = {
      username: 'joemama',
      password: 'password',
    };

    const response = await supertest(app).post('/user/login').send(loginJoe);

    expect(response.status).toBe(200);
  });

  it('should return 400 if username is missing', async () => {
    const badUser = {
      username: '',
      password: 'password',
    };

    const response = await supertest(app).post('/user/login').send(badUser);
    expect(response.status).toBe(400);
    expect(response.text).toEqual('Username and password are required');
  });

  it('should return 400 if password is missing', async () => {
    const badUser = {
      username: 'joemama',
      password: '',
    };

    const response = await supertest(app).post('/user/login').send(badUser);
    expect(response.status).toBe(400);
    expect(response.text).toEqual('Username and password are required');
  });

  it('should return 400 if user does not exist', async () => {
    const badUser = {
      username: 'joemama',
      password: 'password',
    };

    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);

    const response = await supertest(app).post('/user/login').send(badUser);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ success: false, message: 'Invalid username or password' });
  });

  it('should return 400 if password is incorrect', async () => {
    const userJoe = {
      username: 'joemama',
      password: 'password',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: 'img',
      friends: [],
      notifications: [],
    };

    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(userJoe);

    const badUser = {
      username: 'joemama',
      password: 'wrongpassword',
    };

    const response = await supertest(app).post('/user/login').send(badUser);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ success: false, message: 'Invalid username or password' });
  });
  it('should return 400 if the username is not found', async () => {
    const userJoe = {
      username: 'joemama',
      password: 'password',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: 'img',
      friends: [],
      notifications: [],
    };

    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(userJoe);

    const badUser = {
      username: 'wrongusername',
      password: 'password',
    };

    const response = await supertest(app).post('/user/login').send(badUser);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ success: false, message: 'Invalid username or password' });
  });
});

describe('POST /removeFriend', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return 200 if the friend is successfully removed', async () => {
    const userJoe = {
      id: '123123',
      username: 'joemama',
      password: 'password',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: 'img',
      friends: ['suemama'],
      notifications: [],
      save: jest.fn().mockResolvedValue(true),
    };

    const friendSue = {
      id: '111111',
      username: 'suemama',
      password: 'password',
      name: 'Sue Mama',
      email: 'suemama@gmail.com',
      pronouns: 'she/her',
      image: 'img',
      friends: ['joemama'],
      notifications: [],
      save: jest.fn().mockResolvedValue(true),
    };

    const removeFriend = {
      user: userJoe,
      friend: friendSue,
    };

    jest.spyOn(UserModel, 'findOne').mockResolvedValue(userJoe).mockResolvedValue(friendSue);

    const mockSave = jest.fn().mockResolvedValue(true);
    jest.spyOn(userJoe, 'save').mockImplementation(mockSave);
    jest.spyOn(friendSue, 'save').mockImplementation(mockSave);

    jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(userJoe);

    const response = await supertest(app).post('/user/removeFriend').send(removeFriend);

    expect(response.status).toBe(200);
  });

  it('should return 400 if the friend is not found', async () => {
    const userJoe = {
      id: '123123',
      username: 'joemama',
      password: 'password',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: 'img',
      friends: [],
      notifications: [],
    };

    const userSuemama = {
      id: '123123',
      username: 'suemama',
      password: 'password',
      name: 'Sue Mama',
      email: 'suemama@gmail.com',
      pronouns: 'she/her',
      image: 'img',
      friends: [],
      notifications: [],
    };

    const notAFriend = {
      uid: '123123',
      friend: userSuemama,
    };

    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(userJoe);

    const response = await supertest(app).post('/user/removeFriend').send(notAFriend);
    expect(response.status).toBe(400);
  });

  it('should return 400 if the uid is misisng', async () => {
    const removeFriend = {
      friend: 'joemama',
    };

    const response = await supertest(app).post('/user/removeFriend').send(removeFriend);
    expect(response.status).toBe(400);
  });

  it('should return 400 if the friend is missing', async () => {
    const removeFriend = {
      uid: '123123',
    };

    const response = await supertest(app).post('/user/removeFriend').send(removeFriend);
    expect(response.status).toBe(400);
  });

  it('should return 400 if the user is not found', async () => {
    const removeFriend = {
      uid: '123123',
      friend: 'joemama',
    };

    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);

    const response = await supertest(app).post('/user/removeFriend').send(removeFriend);
    expect(response.status).toBe(400);
  });
});

describe('GET /getUserByUsername/:username', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return 500 if the username is missing', async () => {
    const request = {
      username: undefined,
    };

    const response = await supertest(app).get('/user/getUserByUsername/:username').send(request);
    expect(response.status).toBe(500);
  });

  it('should return 500 if the user is not found', async () => {
    const request = {
      username: 'joemama',
    };

    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);
    const response = await supertest(app).get('/user/getUserByUsername/:username').send(request);
    expect(response.status).toBe(500);
  });
});

describe('PUT /updateUser', () => {
  afterEach(async () => {
    jest.resetAllMocks();
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose
  });

  const userJoe: User = {
    username: 'joemama',
    password: 'password',
    name: 'Joe Mama',
    email: 'joemama@gmail.com',
    pronouns: 'he/him',
    image: 'img',
    friends: ['suemama'],
    notifications: [],
  };

  it('should return 200 if the user was found', async () => {
    const request = {
      username: 'joemama',
      updatedUser: userJoe,
    };
    jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(userJoe);

    const response = await supertest(app).put('/user/updateUser').send(request);
    expect(response.text).toBe('User updated successfully');
    expect(response.status).toBe(200);
  });

  it('should return 400 if the user was not found', async () => {
    const request = {
      username: 'wat',
      updatedUser: userJoe,
    };

    jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(null);
    const response = await supertest(app).put('/user/updateUser').send(request);
    expect(response.status).toBe(400);
    expect(response.text).toBe('User not found');
  });

  it('should return 400 if the user is missing', async () => {
    const request = {
      username: 'joemama',
      updatedUser: undefined,
    };

    const response = await supertest(app).put('/user/updateUser').send(request);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Missing username or updated user');
  });

  it('should return 400 if the username is missing', async () => {
    const request = {
      username: undefined,
      updatedUser: userJoe,
    };

    const response = await supertest(app).put('/user/updateUser').send(request);
    expect(response.status).toBe(400);
    expect(response.text).toBe('Missing username or updated user');
  });
});
