import React, { useState, useEffect } from 'react';
import './style.css'

const ViewDepartment = () => {
    const [employees, setDepartments] = useState([]);
    const [error, setError] = useState('');

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

    useEffect(() => {

        fetchAllDepartments();
    }, []);
    return (
        <div>
                        {error && <div className="alert alert-danger">{error}</div>}

            <table className="table">
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Head of Department</th>
                        <th>Location</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {employees.map((department, index) => (
                        <tr key={index}>
                            <td>{department.departmentName}</td>
                            <td>{department.departmentHead}</td>
                            <td>{department.location}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewDepartment;
