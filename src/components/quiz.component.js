//quiz page react component 

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

const Quiz = () => {

  const navigate = useNavigate();
  const [quizOptions, setQuizOptions] = useState({
    showAlert: false,
    alertMessage: '',
    alertType: '',
    showOptions: true,
  });
  const [quiz_state, setQuizState] = useState({
    quizSubmitted: false,
    score: null,
    quiz: ''
  });
  const [quiz_questions, Questions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0); // Track current question
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState(new Array(questions.length)); // Initialize with empty slots for each question

  // state variable to control the visibility of the quiz interface
  const [showQuizInterface, setShowQuizInterface] = useState(true);

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setQuizOptions({...quizOptions, [name]: value });
  };

  const fetchQuestions = async () => {
    try {
      const { category, amount, difficulty } = quizOptions;
      const response = await axios.get(`${apiUrl}/quizme/fetch_quiz`, {
        params: { category, amount, difficulty },
      });
      const modifiedQuestions = response.data.questions.map(question => {
        const answers = [...question.incorrect_answers, question.correct_answer];
        const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
        return {...question, answers: shuffledAnswers };
      });
      Questions(response.data.questions)
      setAmount(response.data.amount);
      setCategory(response.data.category);
      setDifficulty(response.data.difficulty);
      setQuestions(modifiedQuestions);
      setUserAnswers(new Array(modifiedQuestions.length)); // Reset user answers for new questions
      setQuizOptions({...quizOptions, showOptions: false });
      setCurrentQuestion(0);
    } catch (error) {
      let errorMessage = 'An unexpected error occurred.';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
        console.error('Error fetching questions:', errorMessage);
      } else {
        console.error(errorMessage);
      }
      setQuizOptions({
     ...quizOptions,
        showAlert: true,
        alertMessage: errorMessage,
        alertType: 'alert-danger',
      });
      setTimeout(() => {
        setQuizOptions({
       ...quizOptions,
          showAlert: false,
          alertMessage: '',
        });
      }, 5000);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setQuizOptions({...quizOptions, showAlert: false });
  };

  const handleUserAnswer = (selectedAnswer) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    handleSubmitQuiz();
    // Hide the quiz interface and show the score
    setShowQuizInterface(false);
  };

  const handleSubmitQuiz = async () => {
    try {
      const questions = quiz_questions;
      const data = {
        amount,
        questions,
        category,
        difficulty,
        user_answers: userAnswers,
      };
      const response = await axios.post(`${apiUrl}/quizme/save_quiz`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const {score } = response.data;
      setQuizState({ quizSubmitted: true, score, quiz: response.data.quiz });
    } catch (error) {
      let errorMessage = 'An unexpected error occurred.';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
        console.error('Error saving quiz:', errorMessage);
      } else {
        console.error(errorMessage);
      }
      setQuizOptions({
     ...quizOptions,
        showAlert: true,
        alertMessage: errorMessage,
        alertType: 'alert-danger',
      });
      setTimeout(() => {
        setQuizOptions({
       ...quizOptions,
          showAlert: false,
          alertMessage: '',
        });
      }, 5000);
    }
  };

  const buttonStyle = {
    width: '150px',
    height: '40px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
  };

  const selectStyle = {
    width: '100%',
    height: '40px',
    marginBottom: '20px',
    color: 'black',
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const centerButtonStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div style={{ padding: '20px' }}> {/* Outer container with padding */}
      {quizOptions.showAlert && <div className={`alert ${quizOptions.alertType}`}>{quizOptions.alertMessage}</div>}
      
      {showQuizInterface && (
        <div style={{ maxWidth: '800px', margin: 'auto', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '15px'}}>
          {quizOptions.showOptions && (
            <>
              <select name="difficulty" onChange={handleOptionChange} value={quizOptions.difficulty} style={selectStyle}>
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              <select name="amount" onChange={handleOptionChange} value={quizOptions.amount} style={selectStyle}>
                <option value="">Select Number of Questions</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>

              <select name="category" onChange={handleOptionChange} value={quizOptions.category} style={selectStyle}>
                <option value="">Select Category</option>
                <option value="general knowledge">General Knowledge</option>
                <option value="science">Science</option>
                <option value="computer science">Computer Science</option>
                <option value="history">History</option>
                <option value="geography">Geography</option>
              </select>
            </>
          )}
          <div style={centerButtonStyle}>
            <button onClick={fetchQuestions} style={{...buttonStyle, display: quizOptions.showOptions? 'block' : 'none' }}>Start Quiz</button>
          </div>

          {questions.length > 0 && (
            <div>
              <h3 style={{ marginBottom: '10px' }}>{`Question ${currentQuestion + 1}: ${questions[currentQuestion].question}`}</h3>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px' }}>
                  <div style={{
                    height: '10px',
                    width: `${progressPercentage}%`,
                    backgroundColor: 'green',
                    borderRadius: '5px'
                  }}></div>
                </div>
                <p style={{ textAlign: 'center' }}>{`Question ${currentQuestion + 1} of ${questions.length}`}</p>
              </div>
              <form>
                {questions[currentQuestion].answers.map((answer, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <input
                      type="radio"
                      id={`answer_${index}`}
                      name="answer"
                      value={answer}
                      checked={selectedAnswer === answer}
                      onChange={(e) => { handleUserAnswer(e.target.value); setSelectedAnswer(e.target.value); }}
                    />
                    <label htmlFor={`answer_${index}`}>{answer}</label>
                  </div>
                ))}
              </form>
              {currentQuestion < questions.length - 1? (
                <button onClick={handleNextQuestion} className="btn btn-secondary mt-3" style={{ backgroundColor: 'green' }}>Next</button>
              ) : (
                <div>
                  <button onClick={handleSubmit} className="btn btn-primary mt-3">Submit </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {!showQuizInterface && quiz_state.quizSubmitted && (
       <div style={{ width: '900px', margin: 'auto', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', fontSize: '24px' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <h1>Your score: {quiz_state.score} %</h1>
         <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Start a New Quiz</button>
       </div>
           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
         <thead>
           <tr>
             <th>Question</th>
             <th>User Answer</th>
             <th>Correct Answer</th>
             <th>Status</th>
           </tr>
         </thead>
         <tbody>
           {quiz_state.quiz.questions.map((row, index) => (
             <tr key={index}>
               <td>{row.question}</td>
               <td>{row.user_answer}</td>
               <td>{row.correct_answer}</td>
               <td style={{ color: row.user_answer === row.correct_answer? 'green' : 'red' }}>{row.user_answer === row.correct_answer? 'Correct' : 'Incorrect'}</td>
             </tr>
           ))}
         </tbody>
       </table>
        </div>
      )}
    </div>
  );
};

export default Quiz;
