# FakeStackOverflow

FakeStackOverflow is a full-stack web application designed to emulate the functionality of the popular Stack Overflow platform. This project enables users to:

- Post questions and engage in discussions.
- Provide and accept answers to questions.
- Upvote and downvote questions and answers.
- Add comments to both questions and answers.
- Categorize content using tags.
- Receive real-time updates for new questions, answers, and votes.
- Filter and search for questions based on tags and keywords.
- Get notifications for interactions on their posts and friend requests.
- Maintain a friends list for easy access to discussions.

## **🛠 Deployment Guide**
The full deployment steps for FakeStackOverflow can be found in the guide below:  

📖 **[Building a 3-Tier Architecture in Kubernetes](https://saideepsamineni.medium.com/building-a-3-tier-architecture-in-kubernetes-42f03e12bcad)**
## Features and Functionalities

These are some sample pictures of the app features:

![allQuestions](resources/allQuestions.png)

![askQuestion](resources/askQuestion.png)

![answerQuestion](resources/answerQuestion.png)

![filterByTag](resources/filterByTag.png)

![search](resources/search.png)

![tags](resources/tags.png)

![notifications](resources/notifications.png)

![friendsList](resources/friendsList.png)

## Database Architecture

The schemas for the database are documented in the directory `server/models/schema`.
A class diagram for the schema definition is shown below:

![Class Diagram](resources/class-diagram.png)

## Tech Stack

### Frontend

- **React.js**: Component-based UI development
- **TypeScript**: Strongly typed JavaScript
- **Axios**: HTTP requests
- **Socket.IO-client**: Real-time updates

### Backend

- **Node.js**: Server-side runtime
- **Express.js**: Web framework for API development
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ORM
- **Socket.IO**: Real-time bidirectional event-based communication
- **Jest**: Testing framework for unit and integration tests

## Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Setup

Clone the repository:

```sh
 git clone https://github.com/saideep2000/fake_stackoverflow.git
 cd fake_stackoverflow
```

#### Install Dependencies

```sh
cd client && npm install
cd ../server && npm install
```

#### Configure Environment Variables

Create a `.env` file in the **client** directory:

```sh
REACT_APP_SERVER_URL=http://localhost:8000
```

Create a `.env` file in the **server** directory:

```sh
MONGODB_URI=mongodb://127.0.0.1:27017/fake_so
CLIENT_URL=http://localhost:3000
PORT=8000
```

#### Start the Application

**Start MongoDB:**

```sh
mongod --dbpath /path/to/data/db
```

**Populate the Database:**

```sh
cd server
npx ts-node populate_db.ts mongodb://127.0.0.1:27017/fake_so
```

**Run Backend Server:**

```sh
cd server
npm start
```

**Run Frontend:**

```sh
cd client
npm start
```

## Running Tests

To run the tests, ensure the MongoDB instance is running and execute:

```sh
cd server
npm test
```

## API Endpoints

The API provides the following key endpoints:

### **Questions**

- `GET /questions` - Fetch all questions
- `POST /questions` - Create a new question
- `GET /questions/:id` - Fetch a specific question by ID
- `POST /questions/upvote/:id` - Upvote a question
- `POST /questions/downvote/:id` - Downvote a question

### **Answers**

- `POST /answers` - Submit an answer
- `GET /answers/:id` - Get answers for a question
- `POST /answers/upvote/:id` - Upvote an answer
- `POST /answers/downvote/:id` - Downvote an answer

### **Tags**

- `GET /tags` - Fetch all available tags
- `GET /tags/:name` - Fetch a tag by name

### **Comments**

- `POST /comments` - Add a comment to a question or answer

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m "Added new feature"`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project is inspired by Stack Overflow and built as a learning exercise in full-stack web development.

