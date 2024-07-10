//navigation bar react component 

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.js';

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { isAuthenticated } = useAuth();

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
  const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';

    return (
      <nav className="navbar navbar-dark navbar-expand-lg custom-navbar-bg">
        <Link to="/" className="navbar-brand">Quiz me</Link>
        {/* Navbar toggler button */}
        <button onClick={toggleNavbar} className={`${classTwo}`} type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded={!collapsed} aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
        <div className={`${classOne}`} id="navbarNavAltMarkup">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
          <Link to="/fetch_quiz" className="nav-link">take a quiz</Link>
          </li>
      <li className="navbar-item">
        <Link to="/signup" className="nav-link">sign up</Link>
      </li>
      <li className="navbar-item">
        <Link to="/signin" className="nav-link">sign in</Link>
      </li>
          <li className="navbar-item">
            <Link to="/signout" className="nav-link">sign out</Link>
          </li>
          <li className="navbar-item">
          <Link to="/past_quizzes" className="nav-link">past quizzes</Link>
        </li>
        <li className="navbar-item">
          <Link to="/leaderboard" className="nav-link">leaderboard</Link>
        </li>
          <li className="navbar-item">
            <Link to="/delete_account" className="nav-link">delete account</Link>
          </li>
      </ul>
      </div>
      </nav>
    );
  }
  
  export default Navbar;
