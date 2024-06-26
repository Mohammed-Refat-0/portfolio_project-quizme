import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const homepageContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Changed from 'center' to 'flex-start'
    height: '100vh',
    textAlign: 'center',
    marginTop: '22vh',
  };

  const navigateButtonStyle = {
    backgroundColor: '#007bff', // Primary button color
    color: '#fff', // Text color
    padding: '0.375rem 0.75rem', // Padding
    border: '1px solid #007bff', // Border
    borderRadius: '0.25rem', // Border radius
    cursor: 'pointer', // Cursor on hover
    fontSize: '1rem', // Font size
    lineHeight: 1.5, // Line height
    textAlign: 'center', // Text alignment
    textDecoration: 'none', // No underline
    display: 'inline-block', // Display type
    fontWeight: '400', // Font weight
    transition: 'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out', // Transition for hover effects
  };
  
  // Adjusted return statement in HomePage component with inline styled NavigateButton
  return (
    <div style={homepageContainerStyle}>
      <h1>Welcome to QuizMe!</h1>
      <p>QuizMe is a competitive quiz-taking website</p>
      <button style={navigateButtonStyle} onClick={() => navigate('/fetch_quiz')}>
        Take a Quiz Now
      </button>
    </div>
  );
}
export default HomePage;
