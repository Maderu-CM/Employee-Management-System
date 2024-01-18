import React, { useState, useEffect } from 'react';

const ViewEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const employeesPerPage = 10;

    const fetchEmployees = (pageNumber) => {
        const startIndex = (pageNumber - 1) * employeesPerPage;
        const endIndex = startIndex + employeesPerPage - 1;

        fetch(`http://127.0.0.1:5000/employees?startIndex=${startIndex}&endIndex=${endIndex}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setEmployees(data.employees);
                    setError('');
                } else {
                    setEmployees([]);
                    setError('Error fetching employees');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setEmployees([]);
                setError('Error fetching employees');
            });
    };

    useEffect(() => {
        // Fetch initial 10 employees when the component mounts
        fetchEmployees(1);
    }, []);  // Empty dependency array ensures it runs only on mount

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchEmployees(newPage); // Fetch the next set of employees
    };

    const totalPages = Math.ceil(employees.length / employeesPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <div>
            <h2>View Employees</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <table className="table">
                <thead>
                    <tr>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Midint</th>
                        <th>Contact</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => (
                        <tr key={index}>
                            <td>{employee.firstname}</td>
                            <td>{employee.lastname}</td>
                            <td>{employee.midint}</td>
                            <td>{employee.contact}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <nav>
                <ul className='pagination justify-content-center'>
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(page - 1)}>
                            Previous
                        </button>
                    </li>
                    {pageNumbers.map((pgNumber) => (
                        <li key={pgNumber} className={`page-item ${page === pgNumber ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(pgNumber)}>
                                {pgNumber}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ViewEmployees;
