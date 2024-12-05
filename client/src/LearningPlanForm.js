import React, { useState } from 'react';
import axios from 'axios';
import './learning plan.css'

const LearningPlanForm = () => {
    const [course, setCourse] = useState('');
    const [experience, setExperience] = useState(0);
    const [learnerType, setLearnerType] = useState('');
    const [days, setDays] = useState(0);
    const [email, setEmail] = useState('');
    const [learningPlan, setLearningPlan] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5001/generate-learning-plan', {
                course,
                experience,
                learner_type: learnerType,
                days,
                email
            });
            setLearningPlan(response.data.learning_plan);
        } catch (error) {
            console.error('Error generating learning plan:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = async () => {
        try {
            await axios.post('http://localhost:5001/send-learning-plan', {
                learning_plan: learningPlan,
                email
            });
            alert('Learning plan sent to email!');
        } catch (error) {
            console.error('Error sending learning plan:', error);
        }
    };

    return (
        <div>
            <form className='learn-form' onSubmit={handleSubmit}>
                <center>
                <fieldset className='learnfield'>
                    <legend className='form-legend'>IntelliQ Learning Plan</legend><br/><br/>
                <table className='plantable'>
                    <tr>
                        <td className='learntabledata'><label className='tablelabel'>Enter Course to generate Learning plan : </label></td>
                        <td className='learntabledata'><input className='form-input' type="text" placeholder="Course" onChange={(e) => setCourse(e.target.value)} required /></td>
                    </tr><br/>
                    <tr>
                        <td className='learntabledata'><label className='tablelabel'>Rate your Experience : </label></td>
                        <input className='form-input' type="number" placeholder="Experience Level (0-10)" onChange={(e) => setExperience(e.target.value)} required />
                    </tr><br />
                    <tr>
                        <td className='learntabledata'><label className='tablelabel'>Select learner Type : </label></td>
                        <td className='learntabledata'><select onChange={(e) => setLearnerType(e.target.value)} required>
                    <option value="">Select Learner Type</option>
                    <option value="slow">Slow</option>
                    <option value="fast">Fast</option>
                    <option value="picky">Picky</option>
                </select></td>
                    </tr><br/>
                    <tr>
                        <td className='learntabledata'><label className='tablelabel'>How many days do you have to complete the course? : </label></td>
                        <td className='learntabledata'><input className='form-input' type="number" placeholder="Days to Complete" onChange={(e) => setDays(e.target.value)} required /></td>
                    </tr><br/>
                    <tr>
                        <td className='learntabledata'><label className='tablelabel'>Enter Email to send Learning plan : </label></td>
                        <td className='learntabledata'><input className='form-input' type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required /></td>
                    </tr>
                </table><br/><br/>
                <center>
                <button className='form-btn' type="submit" disabled={loading}>
                    {loading ? 'Generating...' : 'Generate Learning Plan'}</button></center>
                </fieldset>
                </center>
                
                    <div> 
                    <h1>Your Learning Plan:</h1>
                    <center><div className='learning_plan'><p>{learningPlan}</p></div></center>
                </div>
                
            </form>
            <center><button className='form-btn' onClick={handleSendEmail}>Send to Email</button></center>
        </div>
    );
};

export default LearningPlanForm;

