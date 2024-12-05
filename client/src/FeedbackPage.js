import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './feedback.css'

// Feedback Page
function FeedbackPage() {
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const navigate = useNavigate();

  const submitFeedback = async () => {
    try {
      const response = await axios.post('http://localhost:5002/feedback', {
        comment: feedbackText,
        rating: feedbackRating,
      });
      console.log('Feedback submitted:', response.data);
      alert('Feedback submitted successfully.');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
  
   const handleBack = () => {
    navigate('/generate-questions'); // Navigate back to Question Page
  };
  
  const handleSubmit = () => {
    navigate('/'); // Navigate back to HomePage
  };

  return (
    <div>
      <h1>Submit Feedback</h1>
      <form onSubmit={handleSubmit}>
        <center>
        <fieldset className='feedback-field'>
          <legend>IntelliQ Feedback</legend>
        <br/><br/><br/><br/>
        <label className='feedback-label'>Enter you feedback : </label>
        <textarea className='feedbackarea'
        placeholder="Provide your feedback"
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
      /><br/>
      <br />
      <label className='feedback-label'>Rating: </label>
      <input
        type="number"
        min="1"
        max="5"
        value={feedbackRating}
        onChange={(e) => setFeedbackRating(Number(e.target.value))}
      /><br/>
      <br />
      <button onClick={submitFeedback}>Submit Feedback</button>
      <button onClick={handleBack}>back</button>
        </fieldset>
        </center>
       </form>
    </div>
     
  );
}

export default FeedbackPage;
