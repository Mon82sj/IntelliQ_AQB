import React from 'react';
import { useNavigate } from 'react-router-dom';

function EmployeeDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Employee Dashboard</h1>
      <button onClick={() => navigate('/quiz')}>Quiz Page</button>
      <button onClick={() => navigate('/feedback')}>Feedback Page</button>
      <button onClick={() => navigate('/learning-plan')}>Learning Plan Page</button>
    </div>
  );
}

export default EmployeeDashboard;
