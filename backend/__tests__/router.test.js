// Test suite for the signup route using Jest and Supertest
const request = require('supertest');
const app = require('../server'); // Adjust the path as necessary
const mongoose = require('mongoose');
const User = require('../models/users.model'); // Adjust the path as necessary
require('dotenv').config();

// Setup connection to the test database
beforeAll(async () => {
  const uri = process.env.ATLAS_URI; // Ensure you have a separate test database URI
  await mongoose.connect(uri);
});

//Cleanup: delete all users after each test to ensure isolation
//afterEach(async () => {
  //await User.deleteMany({});
//});

// Disconnect from the database after all tests have run
afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /quizme/signup', () => {
  test('It should respond with 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/quizme/signup')
      .send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Username, password and confirm_password are required');
  });

  test('It should respond with 400 if password and confirm_password do not match', async () => {
    const response = await request(app)
      .post('/quizme/signup')
      .send({ username: 'testuser65', password: '123456', confirm_password: '654321' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Password and confirm_password do not match');
  });

  test('It should respond with 400 if username or password contains invalid characters', async () => {
    const response = await request(app)
      .post('/quizme/signup')
      .send({ username: 'test@user', password: '123456', confirm_password: '123456' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Username and password must contain only English letters and numbers');
  });

  test('It should respond with 400 if the password is less than 6 characters long', async () => {
    const response = await request(app)
      .post('/quizme/signup')
      .send({ username: 'testuser77', password: '123', confirm_password: '123' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Password must be at least 6 characters long');
  });

  test('It should successfully create a new user and respond with 200', async () => {
    const response = await request(app)
      .post('/quizme/signup')
      .send({ username: 'goooogg', password: 'password', confirm_password: 'password' });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('User signed up successfully');
    expect(response.body).toHaveProperty('userId');
  });

  test('It should respond with 400 if the username already exists', async () => {
    // Create a user to test duplication
    await new User({ username: 'newusergfgg', password: 'password', confirm_password: 'password' }).save();

    const response = await request(app)
      .post('/quizme/signup')
      .send({ username: 'newusergfgg', password: 'password', confirm_password: 'password' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Username already exists');
  });
});

/*
curl -X POST http://localhost:5000/quizme/signup \
-H "Content-Type: application/json" \
-d '{"username": "testUser444", "password": "testPass123", "confirm_password": "testPass123"}'
*/
