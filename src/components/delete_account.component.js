//delete page react component 

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.js';
const apiUrl = process.env.REACT_APP_API_URL;

function Delete() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleChange = (setter) => (e) => setter(e.target.value);

  const hideAlert = () => setShowAlert(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const User = { username, password, confirm};

    axios.delete(`${apiUrl}/quizme/deleteaccount`,  { data: User })
      .then(res => {
        setAlertType('alert-success');
        setAlertMessage('Account deleted successfully!');
        setShowAlert(true);
        signOut();
        setTimeout(() => navigate('/'), 3000);
      })
      .catch(err => {
        const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
        console.error('error:', errorMessage);
        setAlertType('alert-danger');
        setAlertMessage(errorMessage);
        setShowAlert(true);
        setTimeout(hideAlert, 5000);
      });

    setUsername('');
    setPassword('');
    setConfirm('');
  };

  return (
    <div>
   {showAlert && <div className={`alert ${alertType}`} role="alert">
        {alertMessage}
      </div>}
      <h3 >Delete your Account</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
        <label > Username:</label>
        <input type="text" required className="form-control" value={username} onChange={handleChange(setUsername)} />
        </div>
        <div className="form-group">
        <label >Password: </label>
        <input type="password" required className="form-control" value={password} onChange={handleChange(setPassword)} />
        </div>
        <div className="form-group">
        <label >Type "delete" to confirm:</label>
        <input type="text" required className="form-control" value={confirm} onChange={handleChange(setConfirm)} />
        </div>
        <p style={{ color: 'red', marginTop: '20px' }}>
           Important: By pressing "Delete Account", your account and all its associated data will be permanently deleted.
        </p>
        <div className="form-group" style={{ marginTop: '20px' }}>
          <input type="submit" value="Delete Account" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}

export default Delete;
