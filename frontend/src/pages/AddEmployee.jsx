import React, { useState, useEffect } from 'react';

function AddEmployee() {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        dateOfBirth: '',
        gender: '',
        contact: '',
        IdentificationNumber: '',
        departmentname: '',
        dateOfEmployment: '',
        contractPeriod: '',
        job: '',
        passportFile: null,
        idCopyFile: null,
        chiefLetterFile: null,
        clearanceLetterFile: null,
        referenceFile: null
    });

    const [departmentNames, setDepartmentNames] = useState([]);

    useEffect(() => {
        fetchDepartmentNames();
    }, []);

    const fetchDepartmentNames = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/select_department');
            if (!response.ok) {
                throw new Error('Error fetching department names');
            }
            const data = await response.json();
            setDepartmentNames(data.assignments.map(assignment => assignment.departmentName));
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching department names.');
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'passportFile' || e.target.name === 'idCopyFile' || e.target.name === 'chiefLetterFile' || e.target.name === 'clearanceLetterFile' || e.target.name === 'referenceFile') {
            setFormData({ ...formData, [e.target.name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert date format to match backend (YYYY-MM-DD)
        const dateOfBirth = new Date(formData.dateOfBirth).toISOString().split('T')[0];
        const dateOfEmployment = new Date(formData.dateOfEmployment).toISOString().split('T')[0];

        const employeeData = {
            ...formData,
            dateOfBirth: dateOfBirth,
            dateOfEmployment: dateOfEmployment
        };

        try {
            // Add employee
            const employeeResponse = await fetch('http://127.0.0.1:5000/addemployee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeData),
            });

            if (!employeeResponse.ok) {
                throw new Error('Error adding employee');
            }

            const employeeResult = await employeeResponse.json();
            const employeeId = employeeResult.employee_id; // Corrected to access the employee_id

            alert('Employee added successfully!');

            // Upload documents
            const documentFormData = new FormData();
            documentFormData.append('passportFile', formData.passportFile);
            documentFormData.append('idCopyFile', formData.idCopyFile);
            documentFormData.append('chiefLetterFile', formData.chiefLetterFile);
            documentFormData.append('clearanceLetterFile', formData.clearanceLetterFile);
            documentFormData.append('referenceFile', formData.referenceFile);

            const documentResponse = await fetch(`http://127.0.0.1:5000/upload_document/${employeeId}`, {
                method: 'POST',
                body: documentFormData,
            });

            if (!documentResponse.ok) {
                throw new Error('Error uploading documents');
            }

            alert('Documents uploaded successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the employee or uploading documents.');
        }
    };

    return (
        <div>
            <h1>Add Employee</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstname">First Name:</label><br />
                <input type="text" id="firstname" name="firstname" value={formData.firstname} onChange={handleChange} required /><br />
                <label htmlFor="lastname">Last Name:</label><br />
                <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} required /><br />
                <label htmlFor="dateOfBirth">Date of Birth (YYYY-MM-DD):</label><br />
                <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required /><br />
                <label htmlFor="gender">Gender:</label><br />
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="select_gender">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select><br />

                <label htmlFor="contact">Contact:</label><br />
                <input type="text" id="contact" name="contact" value={formData.contact} onChange={handleChange} required /><br />
                <label htmlFor="IdentificationNumber">Identification Number:</label><br />
                <input type="text" id="IdentificationNumber" name="IdentificationNumber" value={formData.IdentificationNumber} onChange={handleChange} required /><br />
                <label htmlFor="departmentname">Department Name:</label><br />
                <select id="departmentname" name="departmentname" value={formData.departmentname} onChange={handleChange} required>
                    <option value="">Select Department</option>
                    {departmentNames.map((departmentName, index) => (
                        <option key={index} value={departmentName}>{departmentName}</option>
                    ))}
                </select><br />
                <label htmlFor="dateOfEmployment">Date of Employment (YYYY-MM-DD):</label><br />
                <input type="date" id="dateOfEmployment" name="dateOfEmployment" value={formData.dateOfEmployment} onChange={handleChange} required /><br />
                <label htmlFor="contractPeriod">Contract Period:</label><br />
                <input type="text" id="contractPeriod" name="contractPeriod" value={formData.contractPeriod} onChange={handleChange} required /><br />
                <label htmlFor="job">Job:</label><br />
                <input type="text" id="job" name="job" value={formData.job} onChange={handleChange} required /><br /><br />

                <label htmlFor="passportFile">Passport File:</label><br />
                <input type="file" id="passportFile" name="passportFile" accept=".pdf, .png, .jpg, .jpeg, .gif" onChange={handleChange} required /><br />

                <label htmlFor="idCopyFile">ID Copy File:</label><br />
                <input type="file" id="idCopyFile" name="idCopyFile" accept=".pdf, .png, .jpg, .jpeg, .gif" onChange={handleChange} required /><br />

                <label htmlFor="chiefLetterFile">Chief Letter File:</label><br />
                <input type="file" id="chiefLetterFile" name="chiefLetterFile" accept=".pdf, .png, .jpg, .jpeg, .gif" onChange={handleChange} required /><br />

                <label htmlFor="clearanceLetterFile">Clearance Letter File:</label><br />
                <input type="file" id="clearanceLetterFile" name="clearanceLetterFile" accept=".pdf, .png, .jpg, .jpeg, .gif" onChange={handleChange} required /><br />

                <label htmlFor="referenceFile">Reference File:</label><br />
                <input type="file" id="referenceFile" name="referenceFile" accept=".pdf, .png, .jpg, .jpeg, .gif" onChange={handleChange} /><br /><br />

                <button type="submit">Add Employee & Upload Documents</button>
            </form>
        </div>
    );
}

export default AddEmployee;
