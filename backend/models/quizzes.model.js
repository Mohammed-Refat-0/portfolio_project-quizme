//quiz mongodb schema

const mongoose = require('mongoose'); //import the mongoose package
const Schema = mongoose.Schema; //import the Schema class from mongoose

//create schema for the quiz
const quizSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
  amount: { type: Number, required: true }, //num of questions
  category: { type: String, default: null},
  difficulty: { type: String, default: null },  
  type: { type: String, default: null},        
  questions: [{
    _id: false, // Disable automatic ObjectId creation for each question
    question: { type: String, required: true },
    correct_answer: { type: String, required: true },
    incorrect_answers: { type: [String], required: true },
    user_answer: { type: String, default: null },
    isCorrect: { type: Boolean, default: false }
  }],
  score: { type: Number, default: 0 },
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

//create a model for the quiz
const quiz = mongoose.model('Quiz', quizSchema);

//export the model
module.exports = quiz;
