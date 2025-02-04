import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import UserModel from '../models/users';
import { Notification } from '../types';
import NotificationModel from '../models/notification';

describe('POST /addNotification', () => {
  afterEach(async () => {
    jest.resetAllMocks();
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return 400 if the request does not contain a user ID', async () => {
    const response = {
      body: {
        noti: {
          sender: 'sender',
          receiver: 'receiver',
          type: 'type',
        },
      },
    };
    const res = await supertest(app).post('/notification/addNotification').send(response);
    expect(res.status).toBe(400);
  });

  it('should return 400 if the request does not contain a notification', async () => {
    const validID = new mongoose.Types.ObjectId();
    const response = {
      body: {
        uid: validID,
      },
    };
    const res = await supertest(app).post('/notification/addNotification').send(response);
    expect(res.status).toBe(400);
    expect(res.text).toBe('Invalid request');
  });

  it('should return 400 if the notification does not contain a sender', async () => {
    const response = {
      body: {
        uid: 'uid',
        noti: {
          receiver: 'receiver',
          type: 'type',
        },
      },
    };
    const res = await supertest(app).post('/notification/addNotification').send(response);
    expect(res.status).toBe(400);
  });

  it('should return 400 if the notification does not contain a receiver', async () => {
    const response = {
      body: {
        uid: 'uid',
        noti: {
          sender: 'sender',
          type: 'type',
        },
      },
    };
    const res = await supertest(app).post('/notification/addNotification').send(response);
    expect(res.status).toBe(400);
  });

  it('should return 400 if the notification does not contain a type', async () => {
    const response = {
      body: {
        uid: 'uid',
        noti: {
          sender: 'sender',
          receiver: 'receiver',
        },
      },
    };
    const res = await supertest(app).post('/notification/addNotification').send(response);
    expect(res.status).toBe(400);
  });
});

describe('POST /clearNotification', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return 400 if the user is not found', async () => {
    const validID = new mongoose.Types.ObjectId();
    const response = {
      uid: validID,
      noti: {
        id: validID,
        sender: 'sender',
        receiver: 'receiver',
        type: 'request',
      },
    };

    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);

    const res = await supertest(app).post('/notification/clearNotification').send(response);

    expect(res.text).toBe('User not found');
    expect(res.status).toBe(400);
  });

  it('should return 400 if the request does not contain a user ID', async () => {
    const response = {
      body: {
        noti: {
          sender: 'sender',
          receiver: 'receiver',
          type: 'type',
        },
      },
    };
    const res = await supertest(app).post('/notification/clearNotification').send(response);
    expect(res.status).toBe(400);
  });

  it('should return 400 if the request does not contain a notification', async () => {
    const response = {
      body: {
        uid: 'uid',
      },
    };
    const res = await supertest(app).post('/notification/clearNotification').send(response);
    expect(res.status).toBe(400);
  });

  it('should return 200 if the notification is cleared successfully', async () => {
    const validID = new mongoose.Types.ObjectId();
    const notification: Notification = {
      _id: new mongoose.Types.ObjectId(),
      sender: 'sender',
      receiver: 'receiver',
      type: 'request',
    };
    const response = {
      uid: validID.toString(),
      noti: notification,
    };

    const userJoe = {
      username: 'joemama',
      password: 'password',
      name: 'Joe Mama',
      email: 'joemama@gmail.com',
      pronouns: 'he/him',
      image: 'img',
      friends: [],
      notifications: [notification],
      save: jest.fn().mockResolvedValue(true),
    };

    jest.spyOn(UserModel, 'findById').mockResolvedValueOnce(userJoe);
    const mockSave = jest.fn().mockResolvedValue(true);
    jest.spyOn(userJoe, 'save').mockImplementation(mockSave);

    const res = await supertest(app).post('/notification/clearNotification').send(response);

    // expect(res.text).toBe('Notification cleared successfully');
    expect(res.status).toBe(200);
  });
});

describe('POST /acceptNotification', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return 400 if the user is not found', async () => {
    const response = {
      uid: new mongoose.Types.ObjectId(),
      noti: {
        id: new mongoose.Types.ObjectId(),
        sender: 'sender',
        receiver: 'receiver',
        type: 'request',
      },
    };

    jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);

    const res = await supertest(app).post('/notification/acceptNotification').send(response);

    expect(res.text).toBe('Receiving user not found');
    expect(res.status).toBe(400);
  });

  it('should return 400 if the request does not contain a user ID', async () => {
    const response = {
      body: {
        noti: {
          sender: 'sender',
          receiver: 'receiver',
          type: 'type',
        },
      },
    };
    const res = await supertest(app).post('/notification/acceptNotification').send(response);
    expect(res.status).toBe(400);
  });

  it('should return 400 if the request does not contain a notification', async () => {
    const response = {
      body: {
        uid: 'uid',
      },
    };
    const res = await supertest(app).post('/notification/acceptNotification').send(response);
    expect(res.status).toBe(400);
  });
});

describe('GET /getNotificationById/:nid', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  it('should return 500 if the id is invalid', async () => {
    const response = {
      nid: 'wrongid',
    };

    const res = await supertest(app).get(`/notification/getNotificationById/${response.nid}`);

    expect(res.status).toBe(500);
  });

  it('should return 200 if the id is valid and the notification is found', async () => {
    const validID = new mongoose.Types.ObjectId();
    const notification: Notification = {
      _id: validID,
      sender: 'sender',
      receiver: 'receiver',
      type: 'request',
    };
    const response = {
      nid: validID,
    };

    jest.spyOn(NotificationModel, 'findOne').mockResolvedValueOnce(notification);

    const res = await supertest(app).get(`/notification/getNotificationById/${response.nid}`);

    expect(res.text).toBe(JSON.stringify(notification));
    expect(res.status).toBe(200);
  });
});
