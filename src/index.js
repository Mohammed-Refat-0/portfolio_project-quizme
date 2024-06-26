import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js'; //added .js
import reportWebVitals from './reportWebVitals.js'; //added .js
import { AuthProvider } from './AuthContext.js'; // Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
