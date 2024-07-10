//Test suite for user schema 

const mongoose = require('mongoose'); // Import Mongoose for interacting with MongoDB
const bcrypt = require('bcrypt'); // Import bcrypt to use for comparing the hashed password
const User = require('../models/users.model'); //import the User model one level up from the current directory
const { MongoServerError } = require('mongodb'); //import the MongoServerError class from the mongodb package

// Load environment variables from the .env file
require('dotenv').config();

// Access the MongoDB connection string stored in the ATLAS_URI environment variable
const uri = process.env.ATLAS_URI;

// runs before all tests in this suite to connect to the MongoDB database
beforeAll(async () => {
  await mongoose.connect(uri);
});

// runs after all tests in this suite to disconnect form the MongoDB database
afterAll(async () => {

   await User.deleteMany({ testId: 'usermodeltest' });

  await mongoose.disconnect();
});

// Test suite for the User creation and saving
describe('User Model Tests', () => {
  it('creates and saves a new user successfully', async () => {
    // Create a new user object with username, and password
    const user = new User({
      username: 'aymen',
      password: 'hashed_password',
      leaderboardscore: 0
    });

    const user2 = new User({
      username: 'omar',
      password: 'hashed_password',
      leaderboardscore: 5
    });

    const user3 = new User({
      username: 'kora',
      password: 'hashed_password',
      leaderboardscore: 3
    });


    user.testId = 'usermodeltest'; // Add a testId to the user object to identify it later
    // Save the new user to the database
    await user.save();
    await user2.save();
    await user3.save();

    // Find the saved user by their ID
    console.log(user._id);
    const savedUser = await User.findById(user._id);

    // Assert that the saved user is not null (meaning it was saved successfully)
    expect(savedUser).not.toBeNull();

    // Assert that the username in the saved user matches the value we set
    expect(savedUser.username).toEqual('aymen');

    //assert that the number of completed quizzes is set to their default values
    expect(savedUser.completed_quizzes).toEqual(0);

    // Assert that the password is not stored in plain text and is in hashed form
    expect(savedUser.password).not.toEqual('hashed_password');
    const isMatch = await bcrypt.compare('hashed_password', savedUser.password);
    expect(isMatch).toBe(true);

  });

  // Test case to check that a empty user object is not saved
    it('create user without required field should fail', async () => {
        const user = new User();
    
        // Save the new user to the database
        await user.save()
        .then(() => fail('User should not be saved without required field'))
        .catch(error => {
            expect(error).toBeTruthy();
        });
    });

    // Test case to check that a user with duplicate username is not saved
    it('should not allow duplicate usernames', async () => {
        // Create the first user with a specific username
        const user1 = new User({
          username: "test_user2",
            password: 'hashed_password2'
        });

        user1.testId = 'usermodeltest'; // Add a testId to the user object to identify it later
        // Save the first user to the database
        await user1.save();
      
        // Create a second user with the same username
        const user2 = new User({
          username: "test_user2",
          password: 'hashed_password2'
        });
      
        // Attempt to save the second user and expect an error
        await user2.save()
        .then(() => fail('Expected a duplicate key error but did not get one.'))
        .catch(error => {
          expect(error.code).toEqual(11000);
          expect(error.message).toMatch(/duplicate key error/);
          });
      });
});
