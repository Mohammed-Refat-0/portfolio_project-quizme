# QuizMe: A Competitive Quiz-Taking Website

## Description:
QuizMe is a dynamic and engaging quiz platform built using the MERN stack, allowing users to compete, test their knowledge, and track their progress.

## Features:
Engaging Quiz Taking: Participate in quizzes with various customizable settings (category, difficulty, number of questions). \n 
Competitive Leaderboards: Track your performance against other players and strive for the top spot. \n
Detailed Past Quizzes: Review your past attempts, analyze questions and answers, and identify areas for improvement. \n
Secure Account Management: Create a user account, sign in/out seamlessly, and manage your profile information. \n

## Technologies Used:
Frontend: React
Backend: Node.js, Express
Database: MongoDB (Atlas)
Frontend Libraries/Frameworks: Bootstrap
API: Open Trivia DB
Client-Side Networking: Axios
Database Modeling: Mongoose

## implementation Details
### Backend
Database: MongoDB Atlas, utilizing three collections: \n
Users: Contains fields for name, hashed password, leaderboard score, and number of completed quizzes. \n
Quizzes: Stores quiz metadata including ID, number of questions, category, difficulty, and arrays of fetched questions with user answers and correct answers. \n
Sessions: Securely stores session data. \n
Server: Built with Express.js, handling backend operations and API integration with the database. \n
### Routes:
/quizme/signup: User registration. \n
/quizme/signin: User login. \n
/quizme/signout: User logout. \n
/quizme/delete: Account deletion. \n
/quizme/past_quizzes: Displays past quizzes sorted by criteria. \n
/quizme/leaderboard: Shows the leaderboard. \n
/quizme/fetch_quiz: Fetches a quiz based on parameters (amount, category, difficulty). \n
/quizme/save_quiz: Saves a user's quiz attempt. \n
/quizme/current_user: Retrieves the currently authenticated user's information. \n
### Frontend
React: Used to build the frontend components, including pages for the homepage, quiz taking, leaderboard, past quizzes, delete account, and sign in/out/up functionalities.

## Project Structure:
quizme/
├── backend/
│   ├── __tests__/  // Testing files for backend components
│   ├── models/    // Models for MongoDB data 
│   ├── routes/    // API endpoint definitions
│   ├── server.js   // Main server application file
│   └── ...        // Other backend-related files
├── public/       // Static assets (images, fonts, etc.)
├── src/           // Frontend source code
│   ├── components/  // Individual React components
│   ├── app.js      // Main React application entry point
│   ├── index.js    // Initial setup for React app
│   └── ...        // Other frontend-related files
└── package.json  // Project dependencies and scripts

## Contributing:

While this project is not currently open for external contributions, feel free to reach out if you have suggestions or feedback. There's always room for improvement!

## License:
 MIT License

## Author:
(Mohammed Refat)[https://github.com/Mohammed-Refat-0]
