import React, { useState, useEffect } from 'react';
import './style.css';

const ViewAssignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [error, setError] = useState('');
    const [deleteSuccessNotification, setDeleteSuccessNotification] = useState(false);
    const [updateSuccessNotification, setUpdateSuccessNotification] = useState(false); // New state for update success notification
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [editedAssignment, setEditedAssignment] = useState({
        departmentName: '',
        departmentHead: '',
        Location: ''
    });

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

    const handleEditAssignment = (assignment) => {
        setEditingAssignment(assignment);
        setEditedAssignment({
            departmentName: assignment.departmentName,
            departmentHead: assignment.departmentHead,
            Location: assignment.Location
        });
    };

    const handleUpdateAssignment = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/edit_department/${editingAssignment.departmentnumber}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedAssignment),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'success') {
                // Set the update success notification
                setUpdateSuccessNotification(true);
                setTimeout(() => setUpdateSuccessNotification(false), 2000);

                // Reset editing state
                setEditingAssignment(null);
                setEditedAssignment({
                    departmentName: '',
                    departmentHead: '',
                    Location: ''
                });

                // Reload the department list after successful update
                fetchAllAssignments();
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Error during the fetch request');
        }
    };

    useEffect(() => {
        fetchAllAssignments();
    }, []);

    return (
        <div>
            {/* Success Notification for deletion */}
            {deleteSuccessNotification && (
                <div className="alert alert-success">
                    Assignment deleted successfully!
                </div>
            )}

            {/* Success Notification for update */}
            {updateSuccessNotification && (
                <div className="alert alert-success">
                    Assignment updated successfully!
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
                            <td>{editingAssignment === assignment ? (
                                <input
                                    type="text"
                                    value={editedAssignment.departmentName}
                                    onChange={(e) => setEditedAssignment({ ...editedAssignment, departmentName: e.target.value })}
                                />
                            ) : (
                                assignment.departmentName
                            )}</td>
                            <td>{editingAssignment === assignment ? (
                                <input
                                    type="text"
                                    value={editedAssignment.departmentHead}
                                    onChange={(e) => setEditedAssignment({ ...editedAssignment, departmentHead: e.target.value })}
                                />
                            ) : (
                                assignment.departmentHead
                            )}</td>
                            <td>{editingAssignment === assignment ? (
                                <input
                                    type="text"
                                    value={editedAssignment.Location}
                                    onChange={(e) => setEditedAssignment({ ...editedAssignment, Location: e.target.value })}
                                />
                            ) : (
                                assignment.Location
                            )}</td>
                            <td>
                                {editingAssignment === assignment ? (
                                    <React.Fragment>
                                        <button className="btn btn-primary ml-2" onClick={() => handleUpdateAssignment()}>Save</button>
                                        <button className="btn btn-secondary ml-2" onClick={() => setEditingAssignment(null)}>Cancel</button>
                                    </React.Fragment>
                                ) : (
                                    <button className="btn btn-primary ml-2" onClick={() => handleEditAssignment(assignment)}>Edit</button>
                                )}
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
