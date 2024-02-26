import React, { useState, useEffect } from 'react';
import './style.css';
 // Import the EmployeeDetailsModal component

const ViewEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePages, setHasMorePages] = useState(true);
    const [deleteSuccessNotification, setDeleteSuccessNotification] = useState(false);
    const [loading, setLoading] = useState(false);
    
   

    const fetchEmployees = (page) => {
        setLoading(true);
        fetch(`http://127.0.0.1:5000/employees?page=${page}&pageSize=10`)
            .then((response) => response.json())
            .then((data) => {
                setLoading(false);
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
                setLoading(false);
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

    const handleDeleteEmployee = async (employeeId) => {
        // Check if employeeId is valid
        if (!employeeId) {
            console.error('Invalid employee ID');
            return;
        }

        // Debug the value of employeeId
        console.log('Employee ID:', employeeId);

        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/delete_employee/${employeeId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // If the deletion was successful, fetch the updated list of employees
                fetchEmployees(currentPage);

                // Show delete success notification
                setDeleteSuccessNotification(true);
                setTimeout(() => setDeleteSuccessNotification(false), 2000);
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

            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {error && <div className="alert alert-danger">{error}</div>}

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Firstname</th>
                                <th>Lastname</th>
                                <th>Contact</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee, index) => (
                                <tr key={index}>
                                    <td>{employee.firstname}</td>
                                    <td>{employee.lastname}</td>
                                    <td>{employee.contact}</td>
                                    <td>
                                        <button className="btn btn-danger ml-2" onClick={() => handleDeleteEmployee(employee.id)} disabled={loading}>
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
                            disabled={currentPage === 1 || loading}
                        >
                            Previous Page
                        </button>
                        <span className="mx-2">Page {currentPage}</span>
                        <button
                            className="btn btn-secondary"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!hasMorePages || loading}
                        >
                            Next Page
                        </button>
                    </div>

                    
                    
                </>
            )}
        </div>
    );
};

export default ViewEmployees;
