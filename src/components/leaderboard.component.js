import React, { useState, useEffect } from 'react';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showCurrentUserPanel, setShowCurrentUserPanel] = useState(false);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/quizme/leaderboard`);
      const data = response.data;
      if (data.success) {
        setLeaderboard(data.leaderboard); // Adjusted to match the updated backend response
        if (data.currentUser) {
          setCurrentUser(data.currentUser);
          setShowCurrentUserPanel(true); // Show the panel if currentUser is not null
        }
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard data", error);
    }
  };

  // Define styles for the table, rows, cells, and the current user panel
  const styles = {
    table: {
      width: '100%',
      marginBottom: '1rem',
    },
    row: {
      borderBottom: '1px solid #ccc',
    },
    cell: {
      padding: '8px',
      textAlign: 'left',
    },
    headerCell: {
      padding: '10px',
      background: '#f4f4f4',
      fontWeight: 'bold',
    },
    currentUserPanel: {
      padding: '5px', // Adjust padding as needed
      margin: '20px 0', // Adds margin above and below the panel
      border: '1px solid #ccc', // Adds a border around the panel
      maxWidth: '400px', // Decreases the width of the current user panel
      maxHeight: '200px', // Decrease height to make it less tall
      overflow: 'auto', // Add overflow auto to handle content that might exceed the container size
      background: '#f9f9f9', // Sets a background color for the panel
    }
  };
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Leaderboard</h2>
        {/* Current User Panel */}
        {showCurrentUserPanel && (
          <div style={styles.currentUserPanel}>
            <h4>your standing</h4>
            <p>Username:&nbsp;{currentUser.username} </p>
            <p> Score: {currentUser.leaderboardScore} &nbsp;Rank: {currentUser.rank}</p>
          </div>
        )}
      </div>
      <table style={styles.table}>
        <thead>
          <tr style={styles.row}>
          <th style={{ ...styles.cell, ...styles.headerCell }}>Rank</th>
            <th style={{ ...styles.cell, ...styles.headerCell }}>Username</th>
            <th style={{ ...styles.cell, ...styles.headerCell }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={index} style={styles.row}>
              <td style={styles.cell}>{`${index + 1}`}</td>
              <td style={styles.cell}>{user.username}</td>
              <td style={styles.cell}>{user.leaderboardScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Leaderboard;
