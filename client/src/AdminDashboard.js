import React from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css'
function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <center>
      <fieldset className='admin-field'>
        <legend className='admin-legend'>IntelliQ Admin Dashboard</legend>
            <button className='admin-btn' onClick={() => navigate('/feedback')}>Submit Feedback</button>
            <button className='admin-btn' onClick={() => navigate('/learning-plan')}>Learning Plan</button>
            <button className='admin-btn' onClick={() => navigate('/upload')}>Generate Question Bank</button>
            <button className='admin-btn' onClick={() => navigate('/generate')}>Learn with Quiz </button>
            <button className='admin-btn' onClick={() => navigate('/data')}>Display Data</button>
      </fieldset>
      </center>
    </div>
  );
}

export default AdminDashboard;
