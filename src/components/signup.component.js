import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.js';
const apiUrl = process.env.REACT_APP_API_URL;

function Signup() {
  const [state, setState] = useState({
    username: '',
    password: '',
    confirm_password: '',
    showAlert: false,
    alertMessage: '',
    alertType: '',
  });

  const { signUp } = useAuth();

  const navigate = useNavigate();

  const onChangeUsername = (e) => {
    setState({ ...state, username: e.target.value });
  };

  const onChangePassword = (e) => {
    setState({ ...state, password: e.target.value });
  };

  const onChangeConfirmPassword = (e) => {
    setState({ ...state, confirm_password: e.target.value });
  };

  const hideAlert = () => {
    setState({ ...state, showAlert: false });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      username: state.username,
      password: state.password,
      confirm_password: state.confirm_password,
    };

    axios.post(`${apiUrl}/quizme/signup`, newUser)
      .then(res => {
        console.log(res.data);
        setState({
          ...state,
          showAlert: true,
          alertMessage: 'Signup successful!',
          alertType: 'alert-success',
        });
        signUp();
        setTimeout(() => {
          navigate('/'); // Redirect to home page using navigate
        }, 3000);
      })
      .catch(err => {
        let errorMessage = 'An unexpected error occurred.';
        if (err.response && err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
          console.error('Signup error:', errorMessage);
        } else {
          console.error(errorMessage);
        }
        setState({
          ...state,
          showAlert: true,
          alertMessage: errorMessage,
          alertType: 'alert-danger',
        });
        setTimeout(hideAlert, 5000);
      });
    setState({
      ...state,
      username: '',
      password: '',
      confirm_password: '',
    });
  };

  return (
    <div>
      {state.showAlert && <div className={`alert ${state.alertType}`} role="alert">
        {state.alertMessage}
      </div>}
      <h3>Create New Account</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Username: </label>
          <input type="text"
            required
            className="form-control"
            value={state.username}
            onChange={onChangeUsername}
          />
        </div>
        <div className="form-group">
          <label>Password: </label>
          <input type="password"
            required
            className="form-control"
            value={state.password}
            onChange={onChangePassword}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password: </label>
          <input type="password"
            required
            className="form-control"
            value={state.confirm_password}
            onChange={onChangeConfirmPassword}
          />
        </div>
        <div className="form-group" style={{ marginTop: '20px' }}>
          <input type="submit" value="Create Account" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}

export default Signup;
