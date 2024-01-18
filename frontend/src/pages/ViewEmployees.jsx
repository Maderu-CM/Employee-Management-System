import React, { useState, useEffect } from 'react';
import './style.css'

const ViewEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');

    const fetchAllEmployees = () => {
        fetch('http://127.0.0.1:5000/employees')
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

        fetchAllEmployees();
    }, []);
    return (
        <div>
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
        </div>
    );
};

export default ViewEmployees;
