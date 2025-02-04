import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

export type FakeSOSocket = Server<ServerToClientEvents>;

/**
 * Type representing the possible ordering options for questions.
 */
export type OrderType = 'newest' | 'unanswered' | 'active' | 'mostViewed' | 'friends';

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Object IDs of comments that have been added to the answer by users, or comments themselves if populated
 */
export interface Answer {
  _id?: ObjectId;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[] | ObjectId[];
}

/**
 * Interface representing a User document, which contains:
 * - _id - The unique identifier for the user. Optional field.
 * - username - The username of the user.
 * - password - The password of the user.
 * - name - The name of the user.
 * - email - The email of the user.
 * - pronouns - The pronouns of the user.
 * - image - The image of the user.
 * - friends - An array of usernames that the user is friends with.
 * - notifications - An array of notifications for the user.
 */
export interface User {
  _id?: ObjectId;
  username: string;
  password: string;
  name: string;
  email: string;
  pronouns: string;
  image: string;
  friends: string[];
  notifications: Notification[];
}

/**
 * Interface for the request body when adding a new user.
 * - body - The User being added.
 */
export interface AddUserRequest extends Request {
  body: User;
}

/**
 * Type representing the possible responses for a User-related operation.
 */
export type UserResponse = User | { error: string };

/**
 * Interface for the request parameters when finding a user by their username.
 * - username - The unique identifier of the username.
 */
export interface FindUserByUsernameRequest extends Request {
  params: {
    username: string;
  };
}

/**
 * Interface for the request parameters when finding a user by their username.
 * - username - The unique identifier of the username.
 */
export interface UpdateUserRequest extends Request {
  body: {
    username: string;
    updatedUser: User;
  };
}

/**
 * Interface extending the request body when logging in, which contains:
 * - username - The unique identifier of the user trying to log in.
 * - password - The password of the user attempting to log in.
 */
export interface LoginRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

/**
 * Interface representing a Notification document, which contains:
 * - _id - The unique identifier for the notification. Optional field.
 * - sender - The username of the user who sent the notification.
 * - receiver - The username of the user who received the notification.
 * - type - The type of the notification.
 */

export interface Notification {
  _id: ObjectId;
  sender: string;
  receiver: string;
  type: 'request' | 'accept';
}

/**
 * Interface for the request body when adding a new notification.
 * - uid - The unique identifier of the user the notification is being sent to
 * - noti - The notification being added
 */
export interface NotificationRequest extends Request {
  body: {
    uid: string;
    noti: Notification;
  };
}

/**
 * Type representing the possible responses for an Notification-related operation.
 */
export type NotificationResponse = Notification | { error: string };

/**
 * Interface for the request parameters when finding a notification by its ID.
 * - nid - The unique identifier of the question.
 */
export interface FindNotificationByIdRequest extends Request {
  params: {
    nid: string;
  };
}

/**
 * Interface extending the request body when adding an answer to a question, which contains:
 * - qid - The unique identifier of the question being answered
 * - ans - The answer being added
 */
export interface AnswerRequest extends Request {
  body: {
    qid: string;
    ans: Answer;
  };
}

/**
 * Type representing the possible responses for an Answer-related operation.
 */
export type AnswerResponse = Answer | { error: string };

/**
 * Interface representing a Tag document, which contains:
 * - _id - The unique identifier for the tag. Optional field.
 * - name - Name of the tag
 */
export interface Tag {
  _id?: ObjectId;
  name: string;
  description: string;
}

/**
 * Interface representing a Question document, which contains:
 * - _id - The unique identifier for the question. Optional field.
 * - title - The title of the question.
 * - text - The detailed content of the question.
 * - tags - An array of tags associated with the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - he date and time when the question was asked.
 * - answers - Object IDs of answers that have been added to the question by users, or answers themselves if populated.
 * - views - An array of usernames that have viewed the question.
 * - upVotes - An array of usernames that have upvoted the question.
 * - downVotes - An array of usernames that have downvoted the question.
 * - comments - Object IDs of comments that have been added to the question by users, or comments themselves if populated.
 * - public - A boolean indicating whether the question is public or private.
 */
export interface Question {
  _id?: ObjectId;
  title: string;
  text: string;
  tags: Tag[];
  askedBy: string;
  askDateTime: Date;
  answers: Answer[] | ObjectId[];
  views: string[];
  upVotes: string[];
  downVotes: string[];
  comments: Comment[] | ObjectId[];
  public: boolean;
}

/**
 * Type representing the possible responses for a Question-related operation.
 */
export type QuestionResponse = Question | { error: string };

/**
 * Interface for the request query to find questions using a search string, which contains:
 * - order - The order in which to sort the questions
 * - search - The search string used to find questions
 * - askedBy - The username of the user who asked the question
 */
export interface FindQuestionRequest extends Request {
  query: {
    order: OrderType;
    search: string;
    askedBy: string;
  };
}

/**
 * Interface for the request parameters when finding a question by its ID.
 * - qid - The unique identifier of the question.
 */
export interface FindQuestionByIdRequest extends Request {
  params: {
    qid: string;
  };
  query: {
    username: string;
  };
}

/**
 * Interface for the request body when adding a new question.
 * - body - The question being added.
 */
export interface AddQuestionRequest extends Request {
  body: Question;
}

/**
 * Interface for the request body when upvoting or downvoting a question.
 * - body - The question ID and the username of the user voting.
 *  - qid - The unique identifier of the question.
 *  - username - The username of the user voting.
 */
export interface VoteRequest extends Request {
  body: {
    qid: string;
    username: string;
  };
}

/**
 * Interface for the request body when removing a friend.
 * - body - The user ID of the current user and friend being removed.
 *  - uid - The unique identifier of the user.
 *  - friend - The username of the friend the current user is removing.
 */
export interface RemoveFriendRequest extends Request {
  body: {
    user: User;
    friend: User;
  };
}

/**
 * Interface representing a Comment, which contains:
 * - _id - The unique identifier for the comment. Optional field.
 * - text - The content of the comment.
 * - commentBy - The username of the user who commented.
 * - commentDateTime - The date and time when the comment was posted.
 *
 */
export interface Comment {
  _id?: ObjectId;
  text: string;
  commentBy: string;
  commentDateTime: Date;
}

/**
 * Interface extending the request body when adding a comment to a question or an answer, which contains:
 * - id - The unique identifier of the question or answer being commented on.
 * - type - The type of the comment, either 'question' or 'answer'.
 * - comment - The comment being added.
 */
export interface AddCommentRequest extends Request {
  body: {
    id: string;
    type: 'question' | 'answer';
    comment: Comment;
  };
}

/**
 * Type representing the possible responses for a Comment-related operation.
 */
export type CommentResponse = Comment | { error: string };

/**
 * Interface representing the payload for a comment update event, which contains:
 * - result - The updated question or answer.
 * - type - The type of the updated item, either 'question' or 'answer'.
 */
export interface CommentUpdatePayload {
  result: AnswerResponse | QuestionResponse | UserResponse | null;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a vote update event, which contains:
 * - qid - The unique identifier of the question.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing the payload for an answer update event, which contains:
 * - qid - The unique identifier of the question.
 * - answer - The updated answer.
 */
export interface AnswerUpdatePayload {
  qid: string;
  answer: AnswerResponse;
}

/**
 * Interface representing the payload for an user update event involving friends, which contains:
 * - user - The user being updated.
 * - friend - The friend being added or removed.
 */
export interface UserFriendUpdatePayload {
  user: UserResponse;
  friend: UserResponse;
}

/**
 * Interface representing the payload for an user update event involving notifications, which contains:
 * - user - The user being updated.
 */
export interface UserNotificationUpdatePayload {
  user: User;
  nid: string;
}

/**
 * Interface representing the payload for an notification send event, which contains:
 * - uid - The unique identifier of the user.
 * - notification - The updated notification.
 */
export interface NotificationUpdatePayload {
  uid: string;
  notification: NotificationResponse;
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: QuestionResponse) => void;
  answerUpdate: (result: AnswerUpdatePayload) => void;
  viewsUpdate: (question: QuestionResponse) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (comment: CommentUpdatePayload) => void;
  userUpdate: (user: UserResponse) => void;
  notificationUpdate: (result: NotificationUpdatePayload) => void;
  removeFriend: (user: UserFriendUpdatePayload) => void;
  addFriend: (user: UserFriendUpdatePayload) => void;
  clearNotification: (user: UserNotificationUpdatePayload) => void;
}
