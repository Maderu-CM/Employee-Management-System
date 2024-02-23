import React, { useState, useEffect } from 'react';
import './style.css';

const ViewEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(true);
    const [deleteSuccessNotification, setDeleteSuccessNotification] = useState(false);


    const fetchEmployees = (page) => {
        fetch(`http://127.0.0.1:5000/employees?page=${page}&pageSize=10`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setEmployees(data.employees);
                    setError('');
                    setHasMorePages(data.employees.length === 10);
                } else {
                    setEmployees([]);
                    setError('Error fetching employees');
                    setHasMorePages(false);
                }
            })
            .catch((error) => {
                console.error('Error fetching employees:', error);
                setEmployees([]);
                setError('Error fetching employees');
                setHasMorePages(false);
            });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchEmployees(newPage);
    };

    const handleDeleteEmployee = async (employee_id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            if (!employee_id) {
                console.error('Employee ID is undefined');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:5000/delete_employee/${employee_id}`, {
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

                    // Reload the employee list after successful deletion
                    fetchEmployees(currentPage);
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
        fetchEmployees(currentPage);
    }, [currentPage]);

    return (
        <div>
            {deleteSuccessNotification && (
                <div className="alert alert-success">
                    Employee deleted successfully!
                </div>
            )}

            <div>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search For Employee" />
                    <div className="input-group-append">
                        <button className="btn btn-secondary search-button" type="button">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <table className="table">
                <thead>
                    <tr>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Contact</th>
                        <th>ID Number</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => (
                        <tr key={index}>
                            <td>{employee.firstname}</td>
                            <td>{employee.lastname}</td>
                            <td>{employee.contact}</td>
                            <td>{employee.IdentificationNumber}</td>
                           
                            <td>
                                <button className="btn btn-success ml-2">VIEW</button>
                                <button className="btn btn-primary ml-2">EDIT</button>
                                <button
                                    className="btn btn-danger ml-2"
                                    onClick={() => handleDeleteEmployee(employee.id)}
                                >
                                    DELETE
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <button
                    className="btn btn-secondary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
                <span className="mx-2">Page {currentPage}</span>
                <button
                    className="btn btn-secondary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasMorePages}
                >
                    Next Page
                </button>
            </div>
        </div>
    );
};

export default ViewEmployees;
