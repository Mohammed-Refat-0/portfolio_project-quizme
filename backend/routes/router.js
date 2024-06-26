const bcrypt = require('bcrypt'); 
const router = require('express').Router();
const fetch = require('node-fetch');

const User = require('../models/users.model');
const Quiz = require('../models/quizzes.model');
const quiz = require('../models/quizzes.model');


// **Signup Route (POST /quizme/signup)**
router.route('/signup').post(async (req, res) => {
    try {

      if (req.session.userId) {
        req.session.destroy();
      }
      // Extract username and password from request body
      const { username, password, confirm_password} = req.body;
  
      // Validate username and password
      if (!username || !password || !confirm_password) {
        return res.status(400).json({ error: 'Username, password and confirm_password are required' });
      }

      // Check if password and confirm_password match
        if (password !== confirm_password) {
            return res.status(400).json({ error: 'Password and confirm_password do not match' });
        }

      // Regex for English alphabet and numbers
      const validPattern = /^[a-zA-Z0-9]+$/;

      // Check if username and password match the pattern
      if (!validPattern.test(username) || !validPattern.test(password)) {
         return res.status(400).json({ error: 'Username and password must contain only English letters and numbers' });
       }

      // Check if username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }
  
      // Create a new user object with the extracted username and password
      const newUser = new User({ username, password });
      // Save the new user to the database
      const savedUser = await newUser.save();
      //sigin the user
      req.session.userId = savedUser._id;
      // Respond with success message
      return res.json({ message: 'User signed up successfully', userId: savedUser._id });
      
    } catch (err) {
      console.error('Error signing up:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


// **signin Route (POST /quizme/signin)**
router.route('/signin').post(async (req, res) => {
    try {

      if (req.session.userId) {
        req.session.destroy();
      }
      const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({ error: 'Incorrect username or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect username or password' });
      }

      // Respond with success message and start a session
        req.session.userId = user._id;
        return res.json({ message: 'User signed in successfully', userId: user._id });
      
    } catch (err) {
      console.error('Error signing in:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
});


router.route('/signout').post((req, res) => {
  if (!req.session.userId) {
      return res.status(400).json({ error: 'User is not signed in' });
  }
  // Use a callback with req.session.destroy to handle the asynchronous operation
  req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
          return res.status(500).json({ error: 'Internal server error during signout' });
      }
      res.json({ message: 'User signed out successfully' });
  });
});

/*
// **signout Route (POST /quizme/signout)**
router.route('/signout').post((req,res) => {
    try {
        if (!req.session.userId) {
            return res.status(400).json({ error: 'User is not signed in' });
        }
        req.session.destroy();
        res.json({ message: 'User signed out successfully' });
    } catch (err) {
        console.error('Error signing out:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}); */

// **Delete User account (DELETE /quizme/deleteaccount)**
router.delete('/deleteaccount', async (req, res) => {
    try {
        const {username, password, confirm } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        if (!confirm || confirm !== 'delete') {
            return res.status(400).json({ error: 'Please confirm deletion by typing "delete"' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Incorrect username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect username or password' });
        }

        // Delete all records of the user from the database
        await Quiz.deleteMany({ userId: user._id });
        await User.deleteOne({ _id: user._id });
        if (req.session.userId) {
            req.session.destroy();
        }
        return res.status(204).send('success'); //restful convention to return 204 status code for successful deletion
        
    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).json({ error: 'Internal server error' }); 
    }
});


// **get past quizzes of user Route (POST /quizme/pastquizzes)**
router.get('/past_quizzes', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(400).json({ error: 'User is not signed in' });
    }

    const sort_by = req.query.sort_by;
    //console.log(req.session.userId)
    // Define default sort option
    let sortOptions = { createdAt: -1 };

    // Check if sort_by is valid and set sortOptions accordingly
    if (sort_by) {
      switch (sort_by) {
        case 'lowest_score':
          sortOptions = { score: 1 };
          break;
        case 'highest_score':
          sortOptions = { score: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
      }
    }

    const results = await Quiz.find({ userId: req.session.userId }).sort(sortOptions);
    return res.json({success: true, data: results});

  } catch (err) {
    console.error('Error retrieving past quizzes:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// **get leaderboard Route (GET /quizme/leaderboard)**
router.get('/leaderboard', async (req, res) => {
  try {
    // Fetch the top ten users for the leaderboard
    const topTenLeaderboard = await User.find({}, 'username leaderboardScore')
                                        .sort({ leaderboardScore: -1 })
                                        .limit(10);

    let currentUserData = null;

    if (req.session.userId) {
      // Fetch the current user's data separately
      const currentUser = await User.findById(req.session.userId, 'username leaderboardScore');
      if (currentUser) {
        // Count how many users have a higher score than the current user to determine their rank
        const higherRankedUsers = await User.countDocuments({ leaderboardScore: { $gt: currentUser.leaderboardScore } });
        const currentUserRank = higherRankedUsers + 1; // Rank is the number of higher ranked users + 1
        currentUserData = { ...currentUser.toObject(), rank: currentUserRank };
      }
    }

    // Send the top ten leaderboard and the current user's data in the response
    return res.json({ success: true, leaderboard: topTenLeaderboard, currentUser: currentUserData });

  } catch (err) {
    console.error('Error retrieving leaderboard:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// **Route to fetch quiz questions (GET /quizme/fetch-quiz)**
router.get('/fetch_quiz', async (req, res) => {
  try {
    let { amount, category, difficulty } = req.query;

    let numbersArrayAsString = [10, 20, 30].map(String);
    if (!amount || !numbersArrayAsString.includes(amount)) {
      amount = '10';
    }

    let category_text; 
    if (!category || !['general knowledge', 'history', 'science', 'geography', 'computer science'].includes(category)) {
        category = 'general knowledge';
        category_text = 'general knowledge'; 
    } else {
        category_text = category; 
    }

    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
      difficulty = 'easy';
    }

    // Convert category names to their corresponding IDs
    const categoryMap = {
      'general knowledge': 9,
      'history': 23,
      'science': 17,
      'geography': 22,
      'computer science': 18
    };
    category = categoryMap[category] || 9; // Default to 'general knowledge' if category is not found

    let uri = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;
    console.log(uri);
    let response = await fetch(uri);
    let data = await response.json();

    if (data.response_code !== 0) {
      return res.status(400).json({ error: 'Error fetching quiz questions' });
    }

    let questions = data.results.map(question => {
      return {
        question: question.question,
        correct_answer: question.correct_answer,
        incorrect_answers: question.incorrect_answers
      };
    });

    // Construct the response object with meta data and questions
    let responseObject = {
      amount,
      category: category_text, // Convert back to name
      difficulty,
      type: 'multiple choice',
      questions
    };

    res.status(200).json(responseObject);

  } catch (err) {
    console.error('Error fetching quiz questions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//**Route to save quiz document (POST /quizme/save-quiz)**
router.post('/save_quiz', async (req, res) => {
  try {
    const { amount, questions, category, difficulty, user_answers } = req.body;

    if (!amount || !Array.isArray(questions) || !category || !difficulty || !Array.isArray(user_answers) || questions.length !== parseInt(amount) || user_answers.length !== parseInt(amount)) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const newQuiz = new Quiz({
      amount,
      category,
      difficulty,
      type: 'multiple choice',
      questions: [],
      score: 0
    });

    for (let i = 0; i < amount; i++) {
      newQuiz.questions.push({
        question: questions[i].question,
        correct_answer: questions[i].correct_answer,
        incorrect_answers: questions[i].incorrect_answers,
        user_answer: user_answers[i],
        isCorrect: questions[i].correct_answer === user_answers[i]
      });
    }

    const allAnswersNull = user_answers.every(answer => answer === null);
if (allAnswersNull) {
  newQuiz.score = 0;
} else {
  const score = Math.ceil(newQuiz.questions.filter(question => question.isCorrect).length / amount * 100);
  newQuiz.score = score;
}

    if (req.session.userId) {
      newQuiz.userId = req.session.userId;
      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      await newQuiz.save();
      user.completed_quizzes += 1;
      await user.save();

      //Call updateLeaderboardScore
      await updateLeaderboardScore(user, newQuiz);

      return res.status(201).json({ message: 'Quiz saved successfully', quiz: newQuiz, score: newQuiz.score });
    } else {
      await newQuiz.save();
      return res.status(201).json({ message: 'Quiz saved successfully', quiz: newQuiz, score: newQuiz.score });
    }
  } catch (err) {
    console.error('Error saving quiz:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// function to update the leaderboard score of the user
async function updateLeaderboardScore(user, newQuiz) {
  try {
    const quizzes = await Quiz.find({ userId: user._id });
    const highScoreQuizzes = quizzes.filter(quiz => quiz.score > 90).length;
    const totalQuizzes = quizzes.length;
    const averageScore = quizzes.reduce((acc, quiz) => acc + quiz.score, 0) / totalQuizzes;

    let bonusScore = newQuiz.score;
    if (newQuiz.difficulty === 'medium') {
      bonusScore += 5;
    } else if (newQuiz.difficulty === 'hard') {
      bonusScore += 10;
    }

    const updatedAverageScore = ((averageScore * (totalQuizzes - 1)) + bonusScore) / totalQuizzes;
    const weightedTotalQuizzes = totalQuizzes * 0.2;
    const weightedHighScoreQuizzes = highScoreQuizzes * 0.4;
    const weightedAverageScore = updatedAverageScore * 0.4;

    user.leaderboardScore = (weightedTotalQuizzes + weightedHighScoreQuizzes + weightedAverageScore).toFixed(2);
    //console.log(user.leaderboardScore);
    await user.save();
  } catch (error) {
    console.error('Error fetching quizzes:', error);
  }
}

// **Route to get current user (GET /quizme/current_user)**
router.get('/current_user', async (req, res) => {
  try{
  if (req.session && req.session.userId) {
    // User is logged in
    const currentUser = await User.findById(req.session.userId, 'username leaderboardScore');
    return res.status(201).json({ message: 'User is logged in',username: currentUser.username,id: currentUser._id, leaderboardscore: currentUser.leaderboardScore });
  } else {
    // User is not logged in
    res.status(401).send('User is not logged in');
  }
} catch (err) {
  console.error('Error getting current user:', err);
  res.status(500).json({ error: 'Internal server error' });
}
});

module.exports = router;
