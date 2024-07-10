import React from 'react';
import axios from 'axios'; 
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/navbar.component.js"
import Homepage from "./components/homepage.component.js";
import Quiz from "./components/quiz.component.js";
import Signup from "./components/signup.component.js";
import Signin from "./components/signin.component.js";
import Signout from "./components/signout.component.js";
import PastQuizzes from "./components/past_quizzes.component.js";
import Leaderboard from "./components/leaderboard.component.js";
import Delete from './components/delete_account.component.js';

axios.defaults.withCredentials = true; // Set withCredentials globally for every request to handle cookies


function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <br/>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/fetch_quiz" element={<Quiz />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signout" element={<Signout />} />
          <Route path="/past_quizzes" element={<PastQuizzes />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/delete_account" element={<Delete />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
