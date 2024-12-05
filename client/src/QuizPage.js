//quizpage.js


import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const QuizPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState('Easy');
    const [file, setFile] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [timeTaken, setTimeTaken] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('topic', topic);
        formData.append('numQuestions', numQuestions);
        formData.append('questionType', 'Objective'); // Modify as needed
        formData.append('difficulty', difficulty);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setQuestions(response.data);
            setQuizStarted(true);
            // Start timer
            setTimeTaken(Date.now());
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleAnswerChange = (questionIndex, answer) => {
        setUserAnswers({ ...userAnswers, [questionIndex]: answer });
    };

    const handleSubmit = async () => {
        const correctAnswers = questions.map(q => q.correct_answer);
        const userScore = correctAnswers.reduce((score, answer, index) => {
            return score + (answer === userAnswers[index] ? 1 : 0);
        }, 0);

        // Calculate time taken
        const timeSpent = Math.floor((Date.now() - timeTaken) / 1000);

        setScore(userScore);
        setSubmitted(true);

        // Share score via email
        await axios.post('http://localhost:5000/share-score', {
            name,
            email,
            score: '${userScore}'/'${questions.length}',
            timeTaken: '${timeSpent} seconds',
            totalQuestions: questions.length,
            topic,
            difficulty,
        });
    };

    const generateReport = () => {
        const doc = new jsPDF();
        doc.text(`Quiz Report`, 14, 10);
        doc.text(`Name: ${name}`, 14, 20);
        doc.text(`Email: ${email}`, 14, 30);
        doc.text(`Topic: ${topic}`, 14, 40);
        doc.text(`Difficulty: ${difficulty}`, 14, 50);
        doc.text(`Score: ${score} out of ${questions.length}`, 14, 60);
        
        const timeSpent = Math.floor((Date.now() - timeTaken) / 1000);
        doc.text(`Time Taken: ${timeSpent} seconds`, 14, 70);

        const rows = questions.map((question, index) => [
            question.question,
            userAnswers[index],
            question.correct_answer,
        ]);
        doc.autoTable({
            head: [['Question', 'Your Answer', 'Correct Answer']],
            body: rows,
            startY: 80,
        });
        doc.save('quiz-report.pdf');
    };

    const handleShareScore = async () => {
        const totalQuestions = questions.length;
        let correctAnswersCount = 0;

        // Calculate correct answers
        questions.forEach((question, index) => {
            if (question.correct_answer === userAnswers[index]) {
                correctAnswersCount += 1;
            }
        });

        const scoreString ='${correctAnswersCount}/${totalQuestions}';
        const timeSpent = Math.floor((Date.now() - timeTaken) / 1000);

        // Share score via email and save report to database
        await axios.post('http://localhost:5000/share-score', {
            name,
            email,
            score: scoreString,
            timeTaken: `${timeSpent} seconds`,
            totalQuestions,
            topic,
            difficulty,
        });

        alert('Score report has been sent to your email!');
    };

    return (
        <div>
            <h1>Quiz Application</h1>
            {!quizStarted ? (
                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Number of Questions"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(Number(e.target.value))}
                        min="5"
                        max="50"
                    />
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Upload and Generate Questions</button>
                </div>
            ) : (
                <div>
                    <h2>Quiz Questions</h2>
                    {questions.map((question, index) => (
                        <div key={index}>
                            <p>{question.question}</p>
                            {question.options.map((option, i) => (
                                <div key={i}>
                                    <input
                                        type="radio"
                                        name={`question${index}`}
                                        value={option}
                                        onChange={() => handleAnswerChange(index, option)}
                                    />
                                    {option}
                                </div>
                            ))}
                        </div>
                    ))}
                    <button onClick={handleSubmit}>Submit Quiz</button>
                    {submitted && (
                        <div>
                            <h2>Your Score: {score} out of {questions.length}</h2>
                            <h3>Correct Answers and Your Answers:</h3>
                            <ul>
                                {questions.map((question, index) => (
                                    <li key={index}>
                                        <strong>Question:</strong> {question.question}<br />
                                        <strong>Your Answer:</strong> {userAnswers[index]}<br />
                                        <strong>Correct Answer:</strong> {question.correct_answer}<br /><br />
                                    </li>
                                ))}
                            </ul>
                            <button onClick={generateReport}>Download Score Report</button>
                            <button onClick={handleShareScore}>Send Score Report</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuizPage;