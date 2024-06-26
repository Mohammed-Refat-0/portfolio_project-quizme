
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.js';
const apiUrl = process.env.REACT_APP_API_URL;

function Signin() {
  const [state, setState] = useState({
    username: '',
    password: '',
    showAlert: false,
    alertMessage: '',
    alertType: '',
  });

  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const hideAlert = () => {
    setState(prevState => ({ ...prevState, showAlert: false }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = state;
    const User = { username, password };

    try {
      const res = await axios.post(`${apiUrl}/quizme/signin`, User);
      console.log(res.data);
      setState({
        username: '',
        password: '',
        showAlert: true,
        alertMessage: 'Signin successful!',
        alertType: 'alert-success',
      });
      signIn();
      setTimeout(() => navigate('/'), 3000); // Redirect to home page
    } catch (err) {
      let errorMessage = 'An unexpected error occurred.';
      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = err.response.data.error;
      }
      console.error('Signin error:', errorMessage);
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
      {state.showAlert && <div className={`alert ${state.alertType}`} role="alert">
        {state.alertMessage}
      </div>}
      <h3>Sign in with your Account</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username: </label>
          <input type="text"
            required
            className="form-control"
            name="username"
            value={state.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Password: </label>
          <input type="password"
            required
            className="form-control"
            name="password"
            value={state.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group" style={{ marginTop: '20px' }}>
          <input type="submit" value="Sign In" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}

export default Signin;
