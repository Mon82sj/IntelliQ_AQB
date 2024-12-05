import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './App.css';
import './homepage.css';
function HomePage() {
  const navigate = useNavigate();


  return (
    <div className='home-div'>
      <center>
      <fieldset className='home-field'>
        <legend className='home-legend'>IntelliQ</legend>
      <center>
        <h1 className='home-head'>Welcome to IntelliQ,<br/> the Automated Question Builder</h1>
         <button className='home-btn' onClick={() => navigate('/login-user')}>Login/Register</button>
         {/* <button className='home-btn' onClick={() => navigate('/data')}>View Data</button>
         <button className='home-btn' onClick={() => navigate('/generate-learning-plan')}>Learning Plan</button>
         <button className='home-btn' onClick={() => navigate('/generate-quiz')}>Start Quiz</button>
         <button className='home-btn' onClick={() => navigate('/analyze-feedback')}>Analyze Feedback</button>
         <button className='home-btn' onClick={() => navigate('/feedback')}>Submit Feedback</button> */}
        </center>
      </fieldset>  
      </center>
    </div>
  );
}

export default HomePage;


