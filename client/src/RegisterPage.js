//registerpage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Admin');
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState('');

const sendOtp = async () => {
  try {
    await axios.post('http://localhost:5000/send-otp', { email });
    setIsOtpSent(true);
    setMessage('OTP sent to your email.');
  } catch (error) {
    setMessage('Error sending OTP.');
  }
};

const verifyOtp = async () => {
  try {
    await axios.post('http://localhost:5000/verify-otp', { email, otp });
    setIsVerified(true);
    setMessage('OTP verified successfully. You can now register.');
  } catch (error) {
    setMessage('Invalid or expired OTP.');
  }
};

const registerUser = async () => {
  try {
    await axios.post('http://localhost:5000/register', {
      email,
      username,
      password,
      userType,
    });
    setMessage('Registration successful. You can now login.');
    navigate('/login-user');
  } catch (error) {
    setMessage('Registration failed. Please try again.');
  }
};


  return (
    <center>
      <div className='register-div'>
        <fieldset className='register-field'>
          <legend className='register-legend'>IntelliQ Register</legend>
          {message && <p>{message}</p>}
          <table className='register-table'>
            <tr>
              <td className='register-data'><label >Enter Your Email :</label></td>
              <td className='register-data'>
                <input className='register-input' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </td>
              <button className='register-btn' onClick={sendOtp}>Send OTP</button>
            </tr>
          </table>
          {isOtpSent && (
            <>
              <table className='register-table'>
                <tr>
                  <td className='register-data'><label >Enter OTP :</label></td>
                  <td className='register-data'>
                    <input className='register-input' type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                  </td>
                  <td className='register-data'><button className='register-btn' onClick={verifyOtp}>Verify OTP</button></td>
                </tr>
              </table>
              {isVerified && (
                <>
                  <center>
                    <table className='register-table'>
                      <tr>
                        <td className='register-data'><label >Username:</label></td>
                        <td className='register-data'>
                          <input className='register-input' type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </td>
                      </tr>
                      <tr>
                        <td className='register-data'><label >Password:</label></td>
                        <td className='register-data'>
                          <input className='register-input' type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </td>
                      </tr>
                      <tr>
                        <td className='register-data'><label >User Type:</label></td>
                        <td>
                          <select className='register-data' value={userType} onChange={(e) => setUserType(e.target.value)}>
                            <option value="Admin">Admin</option>
                            <option value="Trainer">Trainer</option>
                            <option value="Employee">Employee</option>
                          </select>
                        </td>
                      </tr>
                    </table>
                  </center>
                  <button onClick={registerUser}>Register</button>
                </>
              )}
            </>
          )}
        </fieldset>
      </div>
    </center>
  );
};

export default RegisterPage;