//loginpage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        emailOrUsername,
        password,
      });

      localStorage.setItem('token', response.data.token); // Store token in localStorage

      // Navigate based on userType
      if (response.data.userType === 'Admin') {
        navigate('/admin-dashboard');
      } else if (response.data.userType === 'Trainer') {
        navigate('/trainer-dashboard');
      } else if (response.data.userType === 'Employee') {
        navigate('/employee-dashboard');
      }
    } catch (error) {
      setMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <center>
      <div className='login-div'>
        <fieldset className='login-field'>
          <legend className='login-legend'>IntelliQ Login</legend>
          {message && <p>{message}</p>}
          <form onSubmit={handleLogin}>
            <table className='t-login'>
              <tr>
                <td className='logindata'><label>Email or Username:</label></td>
                <td className='logindata'>
                  <input
                    className='login-input'
                    type="text"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className='logindata'><label>Password:</label></td>
                <td className='logindata'>
                  <input
                    className='login-input'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className='logindata'>
                  <button className='login-btn' type="submit">Login</button>
                </td>
                <td className='logindata'>
                  <p>Not a user? 
                    <button className='login-btn' onClick={() => navigate('/register')}>Register here</button>
                  </p>
                </td>
              </tr>
            </table>
          </form>
        </fieldset>
      </div>
    </center>
  );
};

export default LoginPage;