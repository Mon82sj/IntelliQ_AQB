import React from 'react';
import { useNavigate } from 'react-router-dom';

function TrainerDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Trainer Dashboard</h1>
      <button onClick={() => navigate('/feedback')}>Feedback Page</button>
      <button onClick={() => navigate('/learning-plan')}>Learning Plan Page</button>
      <button onClick={() => navigate('/question-bank')}>Question Bank Page</button>
    </div>
  );
}

export default TrainerDashboard;
