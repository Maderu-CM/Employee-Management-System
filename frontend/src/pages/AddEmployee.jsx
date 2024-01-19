import React, { useState, useEffect } from 'react';

function AddEmployee() {
    const [formData, setFormData] = useState({
        firstname: '',
        midint: '',
        lastname: '',
        gender: '',
        contact: '',
        departmentname: '',
        hiredate: '',
        educationlevel: '',
        job: '',
        salary: '',
        bonus: '',
        commission: '',
    });
    const [departments, setDepartments] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {

        fetchDepartments();
    }, []);

    const fetchDepartments = () => {
        fetch('http://127.0.0.1:5000/departments')
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setDepartments(data.departments);
                } else {
                    setErrorMessage('Error fetching departments');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setErrorMessage('Error fetching departments');
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;


        const formattedValue = name === 'hiredate' ? value : value;

        setFormData({ ...formData, [name]: formattedValue });
    };

    function handleSubmit(event) {
        event.preventDefault();

        fetch('http://127.0.0.1:5000/add_employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error adding employee: ${response.statusText}`);
                }
                return response.json();
            })
            .then((responseData) => {
                setSuccessMessage(responseData.message);
                setErrorMessage('');
                setFormData({
                    firstname: '',
                    midint: '',
                    lastname: '',
                    gender: '',
                    contact: '',
                    departmentname: '',
                    hiredate: '',
                    educationlevel: '',
                    job: '',
                    salary: '',
                    bonus: '',
                    commission: '',
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                setErrorMessage(error.message || 'Error adding employee');
                setSuccessMessage('');
            });
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginTop: '10px', color: 'blue' }}>
                <h2>REGISTER EMPLOYEE</h2>
            </div>

            <div style={{ width: '50%', alignSelf: 'centre', marginTop: '20px' }}>
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            </div>

            <div style={{ width: '50%', alignSelf: 'center', marginTop: '20px' }}>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', border: '2px ', borderColor: 'blue', padding: '10px' }}>

                        <div style={{ marginTop: '10px', color: 'blue' }}>
                            <h2>PERSONAL DATA</h2>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="firstname" className="col-sm-2 col-form-label">
                                First Name
                            </label>
                            <div className="col-sm-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstname"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <label htmlFor="midint" className="col-sm-2 col-form-label">
                                Midint
                            </label>
                            <div className="col-sm-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="midint"
                                    name="midint"
                                    value={formData.midint}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="lastname" className="col-sm-2 col-form-label">
                                Last Name
                            </label>
                            <div className="col-sm-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastname"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <label htmlFor="gender" className="col-sm-2 col-form-label">
                                Gender
                            </label>
                            <div className="col-sm-4">
                                <select
                                    className="form-select"
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    aria-label="Default select example"
                                >
                                    <option value="" selected>
                                        Select Gender
                                    </option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="contact" className="col-sm-2 col-form-label">
                                Contact
                            </label>
                            <div className="col-sm-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="contact"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="mb-3 row align-items-center">
                                <div className="col-md-6">
                                    <div style={{ color: 'blue' }}>
                                        <h2>PROFESSIONAL DATA</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3 row align-items-center">
                                <div className="col-sm-6">
                                    <label htmlFor="departmentname" className="form-label mb-2">
                                        Department Name
                                    </label>
                                    <select
                                        className="form-select"
                                        id="departmentname"
                                        name="departmentname"
                                        value={formData.departmentname}
                                        onChange={handleInputChange}
                                        aria-label="Select Department"
                                    >
                                        <option value="" selected>
                                            Select Department
                                        </option>
                                        {departments.map((department) => (
                                            <option key={department.departmentnumber} value={department.departmentName}>
                                                {department.departmentName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3 row align-items-center">
                                <div className="col-sm-6">
                                    <label htmlFor="educationlevel" className="form-label mb-2">
                                        Education Level
                                    </label>
                                    <select
                                        className="form-select"
                                        id="educationlevel"
                                        name="educationlevel"
                                        value={formData.educationlevel}
                                        onChange={handleInputChange}
                                        aria-label="Select Education Level"
                                    >
                                        <option value="" selected>
                                            Select Education Level
                                        </option>
                                        <option value="PHD">PHD</option>
                                        <option value="Masters">Masters</option>
                                        <option value="Degree">Degree</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Certificate">Certificate</option>
                                    </select>
                                </div>

                                <div className="col-sm-6">
                                    <label htmlFor="hiredate" className="form-label mb-2">
                                        Hire Date
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="hiredate"
                                        name="hiredate"
                                        value={formData.hiredate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="mb-3 row align-items-center">
                                <div className="col-sm-6">
                                    <label htmlFor="job" className="form-label mb-2">
                                        Job
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="job"
                                        name="job"
                                        value={formData.job}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-sm-6">
                                    <label htmlFor="salary" className="form-label mb-2">
                                        Salary
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="salary"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="mb-3 row align-items-center">
                                <div className="col-sm-6">
                                    <label htmlFor="bonus" className="form-label mb-2">
                                        Bonus
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="bonus"
                                        name="bonus"
                                        value={formData.bonus}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-sm-6">
                                    <label htmlFor="commission" className="form-label mb-2">
                                        Commission
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="commission"
                                        name="commission"
                                        value={formData.commission}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="mb-3 row" style={{ marginBottom: '5px' }}>
                        <div className="col-sm-6 offset-sm-2">
                            <button type="submit" className="btn btn-primary" style={{ transition: 'background-color 0.3s' }}>
                                Add Employee
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEmployee;
