import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserPage() {
  const [userType, setUserType] = useState(null);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // Fetch user info (e.g., after login)
  useEffect(() => {
    const fetchUserInfo = async () => {
      const loggedInEmail = localStorage.getItem('userEmail'); // Assuming the email is stored in localStorage
      if (loggedInEmail) {
        try {
          const response = await axios.post('http://localhost:5002/login-user', {
            email: loggedInEmail
          });
          setUserType(response.data.userType);
          setEmail(response.data.email);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      } else {
        navigate('/login'); // Redirect to login if user not logged in
      }
    };
    fetchUserInfo();
  }, [navigate]);

  // Admin View
  const AdminHomePage = () => (
    <div>
      <h1>Admin Home Page</h1>
      <ul>
        <li><button onClick={() => navigate('/question-bank')}>Generate Question Bank</button></li>
        <li><button onClick={() => navigate('/feedback')}>Feedback Page</button></li>
        <li><button onClick={() => navigate('/learning-plan')}>Learning Plan Generation</button></li>
        <li><button onClick={() => navigate('/quiz')}>Quiz Page</button></li>
      </ul>
    </div>
  );

  // Trainer View
  const TrainerHomePage = () => (
    <div>
      <h1>Trainer Home Page</h1>
      <ul>
        <li><button onClick={() => navigate('/question-bank')}>Generate Question Bank</button></li>
        <li><button onClick={() => navigate('/feedback')}>Feedback Page</button></li>
      </ul>
    </div>
  );

  // Employee View
  const EmployeeHomePage = () => (
    <div>
      <h1>Employee Home Page</h1>
      <ul>
        <li><button onClick={() => navigate('/feedback')}>Feedback Page</button></li>
        <li><button onClick={() => navigate('/learning-plan')}>Learning Plan Generation</button></li>
        <li><button onClick={() => navigate('/quiz')}>Quiz Page</button></li>
      </ul>
    </div>
  );

  // Render based on userType
  return (
    <div>
      <h2>Welcome {email}</h2>
      {userType === 'admin' && <AdminHomePage />}
      {userType === 'trainer' && <TrainerHomePage />}
      {userType === 'employee' && <EmployeeHomePage />}
    </div>
  );
}

export default UserPage;

