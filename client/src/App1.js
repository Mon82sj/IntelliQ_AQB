// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './App.css';
import { CSVLink } from 'react-csv'; // Import CSV download package
import DatePicker from 'react-datepicker'; // Import date picker
import 'react-datepicker/dist/react-datepicker.css'; // Import date picker CSS

Chart.register(...registerables);

const App = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [positiveCount, setPositiveCount] = useState(0);
    const [negativeCount, setNegativeCount] = useState(0);
    const [positiveRatings, setPositiveRatings] = useState([]);
    const [negativeRatings, setNegativeRatings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/feedbacks');
            setFeedbacks(response.data);
            analyzeFeedbacks(response.data);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    };

    const analyzeFeedbacks = (feedbacks) => {
        const positiveFeedbacks = feedbacks.filter(feedback => feedback.rating >= 4);
        const negativeFeedbacks = feedbacks.filter(feedback => feedback.rating < 4);
        
        setPositiveCount(positiveFeedbacks.length);
        setNegativeCount(negativeFeedbacks.length);
        
        setPositiveRatings(positiveFeedbacks.map(feedback => feedback.rating));
        setNegativeRatings(negativeFeedbacks.map(feedback => feedback.rating));
    };

    const handleSearch = () => {
        const filteredFeedbacks = feedbacks.filter(feedback => 
            feedback.comment.toLowerCase().includes(searchTerm.toLowerCase())
        );
        analyzeFeedbacks(filteredFeedbacks);
    };

    const handleDateFilter = () => {
        const filteredFeedbacks = feedbacks.filter(feedback => {
            const feedbackDate = new Date(feedback.date); // Assuming you have a 'date' field in your feedback
            return feedbackDate >= startDate && feedbackDate <= endDate;
        });
        analyzeFeedbacks(filteredFeedbacks);
    };

    const barData = {
        labels: ['Positive Feedback', 'Negative Feedback'],
        datasets: [
            {
                label: 'Positive Feedback Count',
                data: [positiveCount, 0],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Negative Feedback Count',
                data: [0, negativeCount],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const pieData = {
        labels: ['Positive Feedback', 'Negative Feedback'],
        datasets: [
            {
                data: [positiveCount, negativeCount],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)'],
                borderWidth: 2,
            },
        ],
    };

    const lineData = {
        labels: [...Array(Math.max(positiveRatings.length, negativeRatings.length)).keys()].map(i => `Feedback ${i + 1}`),
        datasets: [
            {
                label: 'Positive Ratings',
                data: positiveRatings,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
            },
            {
                label: 'Negative Ratings',
                data: negativeRatings,
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 1)',
                borderColor: 'rgba(255, 99, 132, 1)',
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="app-container">
            <h1>Feedback Analysis</h1>
            <h2>Total Feedbacks: {feedbacks.length}</h2>
            <h2>Positive Feedbacks: {positiveCount}</h2>
            <h2>Negative Feedbacks: {negativeCount}</h2>
            
            <input 
                type="text" 
                placeholder="Search feedback..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="search-input" 
            />
            <button onClick={handleSearch} className="search-button">Search</button>

            <div className="date-filter">
                <DatePicker 
                    selected={startDate} 
                    onChange={(date) => setStartDate(date)} 
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                />
                <DatePicker 
                    selected={endDate} 
                    onChange={(date) => setEndDate(date)} 
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="End Date"
                />
                <button onClick={handleDateFilter} className="date-filter-button">Filter</button>
            </div>

            <div className="export-section">
                <CSVLink data={feedbacks} filename={"feedbacks.csv"} className="export-button">Export to CSV</CSVLink>
            </div>

            <div className="chart-container">
                <h3>Bar Chart</h3>
                <Bar data={barData} options={{
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                    plugins: {
                        legend: {
                            display: true,
                        },
                    },
                }} />
            </div>
            
            <div className="chart-container">
                <h3>Pie Chart</h3>
                <Pie data={pieData} options={{
                    plugins: {
                        legend: {
                            display: true,
                        },
                    },
                }} />
            </div>
            
            <div className="chart-container">
                <h3>Line Graph</h3>
                <Line data={lineData} options={{
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                    plugins: {
                        legend: {
                            display: true,
                        },
                    },
                }} />
            </div>

            <div className="feedback-list">
                <h3>Feedback Details</h3>
                <ul>
                    {feedbacks.map((feedback, index) => (
                        <li key={index}>
                            <strong>Comment:</strong> {feedback.comment} <br />
                            <strong>Rating:</strong> {feedback.rating}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;