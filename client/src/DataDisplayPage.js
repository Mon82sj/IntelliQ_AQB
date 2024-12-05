import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './datadisplay.css'
const DataDisplayPage = () => {
    const [data, setData] = useState({ users: [], feedback: [], learningPlans: [], reports: [], downloads: [] });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    // Modal Component
    const Modal = ({ content, onClose }) => {
        return (
            <div className="modal-backdrop" style={styles.backdrop}>
                <div className="modal-content" style={styles.modalContent}>
                    <h3>Learning Plan</h3>
                    <p>{content}</p>
                    <button onClick={onClose} style={styles.closeButton}>Close</button>
                </div>
            </div>
        );
    };

    const openModal = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalContent('');
    };

    const styles = {  button:{backgroundColor:'red',color:'white',fontWeight:'bolder',padding:'10px',border:'1px solid white',boxShadow:'none',fontSize:'10px'},buttonview:{backgroundColor:'rgb(3, 50, 82)',color:'white',padding:'10px',border:'none',boxShadow:'none',fontSize:'10px'}}

    // Fetching data on component mount
    useEffect(() => {
        fetchData('test_users', 'users');
        fetchData('test_feedback', 'feedback');
        fetchData('monica_learning_plans', 'learningPlans');
        fetchData('test_reports', 'reports');
        fetchData('test_downloads', 'downloads');
    }, []);  // Note: useEffect runs only once when the component mounts

    const fetchData = async (collection, key) => {
        try {
            const response = await axios.get(`http://localhost:5001/${collection}`);
            setData((prevData) => ({ ...prevData, [key]: response.data }));
        } catch (error) {
            console.error(`Error fetching ${collection}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (collection, id) => {
        try {
            await axios.delete(`http://localhost:5001/${collection}/${id}`);
            fetchData(collection, collection); // Refetch data after deletion
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    };

    // Return loading message or content after data has loaded
    if (loading) {
        return <p>Loading...</p>;
    }

    return (
    <div>
    <center>
        <div>
            <h2 className='head'>Users Table</h2>
            <table className='datas-table'>
                <thead>
                    <tr>
                        <th className='data-th'>ID</th>
                        <th className='data-th'>Username</th>
                        <th className='data-th'>Email</th>
                        <th className='data-th'>User Type</th>
                        <th className='data-th'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.users.map(user => (
                        <tr key={user._id}>
                            <td className='data-td'>{user._id}</td>
                            <td className='data-td'>{user.username}</td>
                            <td className='data-td'>{user.email}</td>
                            <td className='data-td'>{user.userType}</td>
                            <td className='data-td'>
                                <button style={styles.button} className='delete' onClick={() => handleDelete('test_users', user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className='head'>Feedback Table</h2>
            <table className='datas-table'>
                <thead>
                    <tr>
                        <th className='data-th'>ID</th>
                        <th className='data-th'>Feedback</th>
                        <th className='data-th'>Ratings</th>
                        <th className='data-th'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.feedback.map(item => (
                        <tr key={item._id}>
                            <td className='data-td'>{item._id}</td>
                            <td className='data-td'>{item.comment}</td>
                            <td className='data-td'>{item.rating}</td>
                            <td className='data-td'>
                                <button style={styles.button} className='delete' onClick={() => handleDelete('test_feedback', item._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <h2 className='head'>Learning Plans Table</h2>
                <table className='datas-table'>
                    <thead>
                        <tr>
                            <th className='data-th'>ID</th>
                            <th className='data-th'>Course</th>
                            <th className='data-th'>Experience</th>
                            <th className='data-th'>Learner Type</th>
                            <th className='data-th'>Days</th>
                            <th className='data-th'>Learning Plan</th>
                            <th className='data-th'>Email Sent</th>
                            <th className='data-th'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.learningPlans.map(plan => (
                            <tr key={plan._id}>
                                <td className='data-td'>{plan._id}</td>
                                <td className='data-td'>{plan.course}</td>
                                <td className='data-td'>{plan.experience}</td>
                                <td className='data-td'>{plan.learner_type}</td>
                                <td className='data-td'>{plan.days}</td>
                                <td className='data-td'>
                                    {/* Shortened content */}
                                    {plan.learning_plan.slice(0, 50)}...
                                    <button style={styles.buttonview} onClick={() => openModal(plan.learning_plan)}>
                                        View More
                                    </button>
                                </td>
                                <td className='data-td'>{plan.email_sent ? "Yes" : "No"}</td>
                                <td className='data-td'>
                                    <button style={styles.button} className='delete' onClick={() => handleDelete('monica_learning_plans', plan._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal Popup */}
                {showModal && <div><Modal content={modalContent} onClose={closeModal} /></div>}
            </div>

            <h2 className='head'>Reports Table</h2>
            <table className='datas-table'>
                <thead>
                    <tr>
                        <th className='data-th'>ID</th>
                        <th className='data-th'>Report</th>
                        <th className='data-th'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.reports.map(report => (
                        <tr key={report._id}>
                            <td className='data-td'>{report._id}</td>
                            <td className='data-td'>{report.report_content}</td>
                            <td className='data-td'>
                                <button style={styles.button} className='delete' onClick={() => handleDelete('test_reports', report._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className='head'>Downloads Table</h2>
            <table className='datas-table'>
                <thead>
                    <tr>
                        <th className='data-th'>ID</th>
                        <th className='data-th'>File Name</th>
                        <th className='data-th'>Format</th>
                        <th className='data-th'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.downloads.map(download => (
                        <tr key={download._id}>
                            <td className='data-td'>{download._id}</td>
                            <td className='data-td'>{download.fileName}</td>
                            <td className='data-td'>{download.format}</td>
                            <td className='data-td'>
                                <button style={styles.button}  className='delete' onClick={() => handleDelete('test_downloads', download._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </center>
        </div>
    );
};


// Styles for Modal and backdrop
const styles = {
    backdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '5px',
        color:'black',
        maxWidth: '700px',
        maxHeight:'500px',
        textAlign: 'center',
        overflowY:'scroll'
    },
    closeButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: 'blue',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px'
    }
};


export default DataDisplayPage;

