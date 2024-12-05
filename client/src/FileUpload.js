import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import './question.css';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [questionType, setQuestionType] = useState('Objective');
    const [difficulty, setDifficulty] = useState('Easy');
    const [message, setMessage] = useState('');
    const [questions, setQuestions] = useState([]);
    const [showAnswers, setShowAnswers] = useState(false); // New state for checkbox
    const [currentShowAnswers, setCurrentShowAnswers] = useState(false); // Separate state for displaying answers
    const [fileFormat, setFileFormat] = useState('xlsx'); // Default file format

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('topic', topic);
        formData.append('numQuestions', numQuestions);
        formData.append('questionType', questionType);
        formData.append('difficulty', difficulty);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('File uploaded and processed successfully.');
            setQuestions(response.data);
            setCurrentShowAnswers(showAnswers); // Update the state to reflect the current checkbox state
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Error uploading file.');
        }
    };

    const handleDownload = async () => {
        try {
            const response = await axios.post('http://localhost:5000/download', {
                format: fileFormat,
                questions: questions,
            }, {
                responseType: 'blob', // Important for downloading files
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'questions.${fileFormat}'); // Change file name as needed
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading file:', error);
            setMessage('Error downloading file.');
        }
    };

    return (
        <div className="container mt-5">
            <><fieldset className='form-field'><legend className='admin-legend'>Generate Question Bank with IntelliQ</legend>
            <form  className='form-question' onSubmit={handleSubmit}>
            <div className="mb-3">
                    <label className="form-label">Upload File: (xlsx, csv, pdf, docx)</label>
                    <input type="file" className="form-control-file" onChange={handleFileChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Topic:</label>
                    <input type="text" className="form-control" value={topic} onChange={(e) => setTopic(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Number of Questions:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(e.target.value)}
                        min="1"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Question Type:</label>
                    <select className="form-select" value={questionType} onChange={(e) => setQuestionType(e.target.value)}>
                        <option value="Objective">Objective</option>
                        <option value="Subjective">Subjective</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Difficulty:</label>
                    <select className="form-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <div className="mb-3">
                    <input 
                        type="checkbox" 
                        checked={showAnswers} 
                        onChange={() => setShowAnswers(!showAnswers)} 
                    />
                    <label className="form-label ms-2">include answers</label>
                </div>
                <button type="submit" className="admin-btn">Upload</button>
            </form>
            </fieldset></>
            {message && <p className="mt-3">{message}</p>}

            {questions.length > 0 && (
                <div className="mt-4">
                    <h3 className='question-head'>Generated Questions:</h3>
                    <ol className="list-group">
                        {questions.map((q, index) => (
                            <li key={index} className="list-group-item">
                                <strong>{q.question}</strong>
                                {questionType === 'Objective' && q.options && (
                                    <ol className="list-group mt-2">
                                        {q.options.map((opt, idx) => (
                                            <li key={idx} className="list-group-item">{opt}</li>
                                        ))}
                                    </ol>
                                )}
                                {currentShowAnswers && questionType === 'Subjective' && (
                                    <p className="mt-2"><strong>Answer:</strong> {q.answer}</p>
                                )}
                                {currentShowAnswers && questionType === 'Objective' && (
                                    <p className="mt-2"><strong>Correct Answer:</strong> {q.correct_answer}</p>
                                )}
                            </li>
                        ))}
                    </ol>
                    
                    {/* File format selection visible only after questions are displayed */}
                    <div className="mb-3 mt-3">
                        <label className="form-label">Select File Format:</label>
                        <select className="form-select" value={fileFormat} onChange={(e) => setFileFormat(e.target.value)}>
                            <option value="xlsx">XLSX</option>
                            <option value="csv">CSV</option>
                            <option value="pdf">PDF</option>
                            <option value="docx">DOCX</option>
                        </select>
                    </div><br/><br/>
                    <center><button onClick={handleDownload} className="admin">Download Questions</button></center>
                </div>
            )}
        </div>
    );
};

export default FileUpload;