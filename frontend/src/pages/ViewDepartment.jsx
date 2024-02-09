import React, { useState, useEffect } from 'react';
import './style.css';

const ViewDepartment = () => {
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    const [deleteSuccessNotification, setDeleteSuccessNotification] = useState(false);

    const fetchAllDepartments = () => {
        fetch('http://127.0.0.1:5000/departments')
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setDepartments(data.departments);
                    setError('');
                } else {
                    setDepartments([]);
                    setError('Error fetching departments');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setDepartments([]);
                setError('Error fetching department');
            });
    };

    const handleDeleteDepartment = async (departmentnumber) => {
        if (window.confirm('Are you sure you want to delete this department and its employees?')) {
            if (!departmentnumber) {
                console.error('departmentnumber is undefined');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:5000/delete_department/${departmentnumber}`, {
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
                    fetchAllDepartments();
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
        fetchAllDepartments();
    }, []);

    return (
        <div>
            {/* Success Notification */}
            {deleteSuccessNotification && (
                <div className="alert alert-success">
                    Department deleted successfully!
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
                    {departments.map((department, index) => (
                        <tr key={index}>
                            <td>{department.departmentName}</td>
                            <td>{department.departmentHead}</td>
                            <td>{department.Location}</td>
                            <td>
                            <button className="btn btn-primary ml-2">VIEW</button>
                                <button className="btn btn-primary ml-2">EDIT</button>
                                <button
                                    className="btn btn-danger ml-2"
                                    onClick={() => handleDeleteDepartment(department.departmentnumber)}
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

export default ViewDepartment;
