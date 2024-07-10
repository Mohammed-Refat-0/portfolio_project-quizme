import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js'; 
import reportWebVitals from './reportWebVitals.js';
import { AuthProvider } from './AuthContext.js'; // Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
