//backend server file

// imports the Express, cors, mongoose, dotenv, express-session, connect-mongo, path packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config(); //configure 'dotenv' package to automatically load the environment variables from the .env file into process.env


const app = express(); //creates an instance of the Express application
const port = process.env.PORT || 5000; //defines the port number on which the server will listen for incoming requests
app.use(express.json()); //convert the request body (if it's JSON) into a JavaScript object.

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // environment variable for session key
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.ATLAS_URI }), //store the session data in the MongoDB database
  cookie: { secure: 'auto', httpOnly: true, maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  }
}));

// enable CORS for all requests to allows requests from different domains to interact with the API
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true // Allows the server to accept requests with credentials (cookies, HTTP authentication)
}));


const uri = process.env.ATLAS_URI; //assign the connection URL from env variable 
mongoose.connect(uri); //connect to the MongoDB database using the connection URL
const connection = mongoose.connection; //assign the connection object to a variable to interact with the database
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
}) //outputs a message to the console once the connection is open


const Router = require('./routes/router'); //import the router file
app.use('/quizme', Router); //add the router file to the Express app

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// starts the server and makes it listen for incoming requests on the specified port.
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;
