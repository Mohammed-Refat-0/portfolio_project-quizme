import React, { useState } from 'react';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

function PastQuizzes() {
  const [sortOption, setSortOption] = useState('newest');
  const [quizzes, setQuizzes] = useState([]);
  const [alert, setAlert] = useState({
    showAlert: false,
    alertMessage: '',
    alertType: 'alert-danger',
  });

  const handleChange = (e) => {
    setSortOption(e.target.value);
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${apiUrl}/quizme/past_quizzes?sort_by=${sortOption}`);
      // Adjusted to check if response.data.data is an array before setting the state
      if (Array.isArray(response.data.data)) {
        setQuizzes(response.data.data); // Use the nested data array
      } else {
        console.error('Expected an array but received:', response.data.data);
        setQuizzes([]); // Set to empty array or handle as needed
      }
      setAlert({ ...alert, showAlert: false });
    } catch (err) {
      let errorMessage = 'An unexpected error occurred.';
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error;
      } else if (!err.response) {
        errorMessage = 'Network error or server is down.';
      }
      console.error('error:', errorMessage);
      setAlert(prevAlert => ({
        ...prevAlert,
        showAlert: true,
        alertMessage: errorMessage,
        alertType: 'alert-danger',
      }));
      setTimeout(() => setAlert(prevAlert => ({
        ...prevAlert,
        showAlert: false
      })), 5000);
    }
  };


  return (
    <div>
      {alert.showAlert? (
        <div className={`alert ${alert.alertType}`} role="alert">
          {alert.alertMessage}
        </div>
      ) : null}
  
      <h3>Your Past Quizzes</h3>
      <div className="d-flex align-items-center mb-3">
        <span className="me-2">Sort by:</span>
        <select className="form-select me-2" value={sortOption} onChange={handleChange} style={{ width: 'auto', maxWidth: '200px' }}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest_score">Highest Score</option>
          <option value="lowest_score">Lowest Score</option>
        </select>
        <button onClick={fetchQuizzes} className="btn btn-primary">Refresh Quizzes</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Score</th>
            <th>Date</th>
            <th>Difficulty</th>
            <th>Category</th>
            <th>Number of Questions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz, index) => (
            <tr key={index}>
              <td>{quiz.score}</td>
              <td>{new Date(quiz.createdAt).toLocaleDateString()}</td>
              <td>{quiz.difficulty}</td>
              <td>{quiz.category}</td>
              <td>{quiz.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PastQuizzes;
