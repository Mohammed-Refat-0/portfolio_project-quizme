//user mongodb schema

// import bcrypt, mongoose
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 

const Schema = mongoose.Schema;

// Create schema for the user
const userSchema = new Schema({
    username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  completed_quizzes: {
    type: Number,
    default: 0
  },
  leaderboardScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving a new user or password is changed
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

// Create a model for the user in mongodb
const user = mongoose.model('user', userSchema);

// Export the model
module.exports = user;
