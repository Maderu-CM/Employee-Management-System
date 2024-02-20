import React, { useState, useEffect } from 'react';
import './style.css';

const ViewAssignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [error, setError] = useState('');
    const [deleteSuccessNotification, setDeleteSuccessNotification] = useState(false);

    const fetchAllAssignments = () => {
        fetch('http://127.0.0.1:5000/assignments')
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setAssignments(data.assignments);
                    setError('');
                } else {
                    setAssignments([]);
                    setError('Error fetching assignments');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setAssignments([]);
                setError('Error fetching assignment');
            });
    };

    const handleDeleteAssignment = async (departmentnumber) => {
        if (window.confirm('Are you sure you want to delete this Assignment and its employees?')) {
            if (!departmentnumber) {
                console.error('departmentnumber is undefined');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:5000/delete_assignment/${departmentnumber}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (data.status === 'success') {
                    // Set the notification to true for a short duration
                    setDeleteSuccessNotification(true);
                    setTimeout(() => setDeleteSuccessNotification(false), 2000);

                    // Wait for a short duration to allow the server to update the data
                    await new Promise((resolve) => setTimeout(resolve, 500));

                    // Reload the department list after successful deletion
                    fetchAllAssignments();
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                alert('Error during the fetch request');
            }
        }
    };

    useEffect(() => {
        fetchAllAssignments();
    }, []);

    return (
        <div>
            {/* Success Notification */}
            {deleteSuccessNotification && (
                <div className="alert alert-success">
                    Assignment deleted successfully!
                </div>
            )}

            {/* Error Notification */}
            {error && <div className="alert alert-danger">{error}</div>}

            <table className="table">
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Head of Department</th>
                        <th>Location</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment, index) => (
                        <tr key={index}>
                            <td>{assignment.departmentName}</td>
                            <td>{assignment.departmentHead}</td>
                            <td>{assignment.Location}</td>
                            <td>
                            <button className="btn btn-primary ml-2">VIEW</button>
                                <button className="btn btn-primary ml-2">EDIT</button>
                                <button
                                    className="btn btn-danger ml-2"
                                    onClick={() => handleDeleteAssignment(assignment.departmentnumber)}
                                >
                                    DELETE
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewAssignment;
