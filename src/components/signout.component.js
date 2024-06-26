import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.js';
const apiUrl = process.env.REACT_APP_API_URL;

function Signout() {
  const [state, setState] = useState({
    showAlert: false,
    alertMessage: '',
    alertType: '',
  });

  const navigate = useNavigate();
  const { signOut } = useAuth();

  const hideAlert = () => {
    setState(prevState => ({ ...prevState, showAlert: false }));
  };

  const handleSignout = async () => {
    try {
      const res = await axios.post(`${apiUrl}/quizme/signout`);
      console.log(res.data);
      setState({
        showAlert: true,
        alertMessage: 'Signout successful!',
        alertType: 'alert-success',
      });
      signOut(); 
      setTimeout(() => navigate('/'), 3000); // Redirect to home page
    } catch (err) {
      let errorMessage = 'An unexpected error occurred.';
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error;
      } else if (!err.response) {
        errorMessage = 'Network error or server is down.';
      }
      console.error('Signout error:', errorMessage);
      setState(prevState => ({
        ...prevState,
        showAlert: true,
        alertMessage: errorMessage,
        alertType: 'alert-danger',
      }));
      setTimeout(hideAlert, 5000);
    }
  };

  return (
    <div>
      <p>Press the signout button to sign out</p>
      <button onClick={handleSignout} className="btn btn-primary">Sign Out</button>
      {state.showAlert && (
        <div className={`alert ${state.alertType}`} role="alert">
          {state.alertMessage}
        </div>
      )}
    </div>
  );
}

export default Signout;
