const mongoose = require('mongoose'); // Import Mongooge
const Quiz = require('../models/quizzes.model'); // import quiz model
const User = require('../models/users.model'); //import the User model

// Load environment variables from the .env file
require('dotenv').config();

// Access the MongoDB connection string stored in the ATLAS_URI environment variable
const uri = process.env.ATLAS_URI;

// function runs before all tests in this suite
beforeAll(async () => {
  // Connect to the MongoDB database using the connection string
  await mongoose.connect(uri);
});

// This function runs after all tests in this suite
afterAll(async () => {

  //add a line to delete all craeated data from this suite after it finshes:
  await Quiz.deleteMany({ testId: 'quizmodeltest' });

  // Disconnect from the MongoDB database
  await mongoose.disconnect();
});

describe('Quiz Model Tests', () => {
  it('creates and saves a new quiz successfully', async () => {
    // Create a dummy user object with a username
    const user = new User({ username: 'ahmed', password: 'hashed_password', leaderboardscore: 4});

    // Save the dummy user to the database
    await user.save();

    // Create a new Quiz object with various properties
    const quiz = new Quiz({
      userId: user._id, // Reference the saved user's ID
      amount: 2,
      category: 'Art',
      difficulty: 'Medium',
      type: 'Multiple Choice',
      questions: [
        // Define dummy question here with the quiz schema:
        {
          question: 'What is the capital of France?',
          correct_answer: 'Paris',
          incorrect_answers: ['London', 'Berlin', 'Madrid'],
          user_answer: 'Paris',
          isCorrect: true
        },
        {
          question: 'What is the capital of Spain?',
          correct_answer: 'Madrid',
          incorrect_answers: ['Paris', 'London', 'Berlin']
        },
      ],
      score: 8 // Dummy score (replace with calculated score)
    });

    // Save the new quiz to the database
    await quiz.save();

    const quiz2 = new Quiz({
      userId: user._id, // Reference the saved user's ID
      amount: 2,
      category: 'Art',
      difficulty: 'Medium',
      type: 'Multiple Choice',
      questions: [
        // Define dummy question here with the quiz schema:
        {
          question: 'What was the name of ancient egypt?',
          correct_answer: 'kemt',
          incorrect_answers: ['lemt', 'hemt', 'gemt'],
          user_answer: 'kemt',
          isCorrect: true
        },
        {
          question: 'What is the capital of Spain?',
          correct_answer: 'Madrid',
          incorrect_answers: ['Paris', 'London', 'Berlin']
        },
      ],
      score: 8 // Dummy score (replace with calculated score)
    });

    // Save the new quiz to the database
    await quiz2.save();

    // Find the saved quiz by its ID
    const savedQuiz = await Quiz.findById(quiz._id);

    // Assert that the saved quiz is not null (meaning it was saved successfully)
    expect(savedQuiz).not.toBeNull();

    // Assert that the number of questions in the saved quiz matches the value we set
    expect(savedQuiz.amount).toEqual(2);

    // Add asseration to check that the second quettion user_answer and iscorrect is default:
    expect(savedQuiz.questions[1].user_answer).toBeNull();
    expect(savedQuiz.questions[1].isCorrect).toBe(false);

    //add user_answer, save , and assert that it is not null:
    savedQuiz.questions[1].user_answer = 'Berlin';
    await savedQuiz.save();
    expect(savedQuiz.questions[1].user_answer).toEqual('Berlin');

    //assert that user id not equal to quiz id:
    expect(user._id).not.toEqual(savedQuiz._id);
  });

  // Add a test case to save a quiz without a user:
    it('creates and saves a new quiz without a user', async () => {
        // Create a new Quiz object without a user ID
        const quiz = new Quiz({
        amount: 30,
        category: null,
        type: 'Multiple Choice',
        questions: [
            //
        ],
        overallScore: 5 // Dummy score (replace with calculated score)
        });
    
        // Save the new quiz to the database
        await quiz.save();
    
        // Find the saved quiz by its ID
        const savedQuiz = await Quiz.findById(quiz._id);
    
        // Assert that the saved quiz is not null (meaning it was saved successfully)
        expect(savedQuiz).not.toBeNull();
    
        // Assert that the user ID in the saved quiz is null
        expect(savedQuiz.userId).toBeNull();

        //assert that the category and difficulty are null:
        expect(savedQuiz.category).toBeNull();
        expect(savedQuiz.difficulty).toBeNull();
    });
});
