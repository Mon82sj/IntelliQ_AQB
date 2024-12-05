import React, { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './feedback.css';
const FeedbackAnalysis = () => {
    const [feedbackData, setFeedbackData] = useState(null);
    const [loading, setLoading] = useState(false);

    const analyzeFeedback = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5003/get-feedback-analysis');
            setFeedbackData(response.data);
        } catch (error) {
            console.error("Error analyzing feedback:", error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#36A2EB', '#FF6384'];

    const pieData = [
        { name: 'Positive', value: feedbackData?.positive_count },
        { name: 'Negative', value: feedbackData?.negative_count }
    ];

    const lineData = feedbackData?.sentiments.map((item, index) => ({
        index: index + 1,
        sentiment: item[1]
    })) || [];

    return (
        <div>

<h1>intelliq Feedback Analysis</h1>
            <center>
            <fieldset>
                <legend>IntelliQ Feedback</legend>
            <center><button className='feedback-btn' onClick={analyzeFeedback} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze Feedback"}
            </button>
</center>
            </fieldset></center>
            {feedbackData && (
                <div>
                    <center><h1>Analysis Results</h1></center>
                    <h2>Positive Feedback: {feedbackData.positive_count}</h2>
                    <h2>Negative Feedback: {feedbackData.negative_count}</h2>
                    <h2>Suggestions</h2>
                    <h3>{feedbackData.suggestions}</h3>

                    <h1>Pie Chart</h1>
                    <PieChart width={400} height={400}>
                        <Pie
                            data={pieData}
                            cx={200}
                            cy={200}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>

                    <h1>Line Chart</h1>
                    <LineChart
                        width={600}
                        height={300}
                        data={lineData}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                        }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sentiment" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </div>
            )}
        </div>
    );
};

export default FeedbackAnalysis;

