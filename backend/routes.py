from flask import jsonify
from flask import Flask, render_template, request, redirect, url_for, jsonify
from app import db, Employee, Assignment, app
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

from datetime import datetime

CORS(app)

app.config['JWT_SECRET_KEY'] = 'kjsfhiuyrnAUTdjhddjlkjfeadDAlHgDM'

# Adding an employee
@app.route('/add_employee', methods=['POST'])
def add_employee():
    try:
        data = request.form

        # Check if all required fields are present
        required_fields = ['firstname', 'lastname', 'date_of_birth', 'gender', 'contact',
                           'identification_number', 'department_name', 'date_of_employment',
                           'contract_period', 'job', 'passport', 'id_copy', 'chief_letter',
                           'clearance_letter', 'reference']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

        firstname = data['firstname']
        lastname = data['lastname']
        date_of_birth = data['date_of_birth']
        gender = data['gender']
        contact = data['contact']
        identification_number = data['identification_number']
        department_name = data['department_name']
        date_of_employment = data['date_of_employment']
        contract_period = data['contract_period']
        job = data['job']
        passport_file = request.files['passport']
        id_copy_file = request.files['id_copy']
        chief_letter_file = request.files['chief_letter']
        clearance_letter_file = request.files['clearance_letter']
        reference_file = request.files['reference']

        # Convert date strings to datetime objects
        date_of_birth = datetime.strptime(date_of_birth, '%Y-%m-%d')
        date_of_employment = datetime.strptime(date_of_employment, '%Y-%m-%d')

        # Retrieve department
        department = Assignment.query.filter_by(departmentName=department_name).first()
        if not department:
            return jsonify({'error': 'Department not found'}), 404

        # Save files and get file paths
        passport_filepath = save_file(passport_file)
        id_copy_filepath = save_file(id_copy_file)
        chief_letter_filepath = save_file(chief_letter_file)
        clearance_letter_filepath = save_file(clearance_letter_file)
        reference_filepath = save_file(reference_file)

        # Create employee instance
        new_employee = Employee(
            firstname=firstname,
            lastname=lastname,
            dateOfBirth=date_of_birth,
            gender=gender,
            contact=contact,
            IdentificationNumber=identification_number,
            departmentnumber=department.departmentnumber,
            dateOfEmployment=date_of_employment,
            contractPeriod=contract_period,
            job=job,
            passport_filepath=passport_filepath,
            IdCopy_filepath=id_copy_filepath,
            ChiefLetter_filepath=chief_letter_filepath,
            ClearanceLetter_filepath=clearance_letter_filepath,
            Reference_filepath=reference_filepath
        )

        db.session.add(new_employee)
        db.session.commit()

        return jsonify({'message': 'New Employee added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def save_file(file):
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return filename
    return None

# Add a department
@app.route('/add_assignment', methods=['POST'])
def add_department():
    try:
        data = request.get_json()

        departmentName = data.get('departmentName')
        departmentHead = data.get('departmentHead')
        Location = data.get('Location')

        new_assignment = Assignment(
            departmentName=departmentName,
            departmentHead=departmentHead,
            Location=Location
        )

        db.session.add(new_assignment)
        db.session.commit()

        return jsonify({'message': 'New Department registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# view employees
@app.route('/employees', methods=['GET'])
def view_employees():
    try:
        page = request.args.get('page', default=1, type=int)
        page_size = request.args.get('pageSize', default=10, type=int)

        offset = (page - 1) * page_size

        employees = Employee.query.offset(offset).limit(page_size).all()

        employee_list = []
        for employee in employees:
            employee_data = {
                'id': employee.id,
                'firstname': employee.firstname,
                'midint': employee.midint,
                'lastname': employee.lastname,
                'contact': employee.contact
            }
            employee_list.append(employee_data)

        return jsonify({'status': 'success', 'employees': employee_list})

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

# view details of a specific user.
@app.route('/employees/<int:employee_id>', methods=['GET'])
def view_employee(employee_id):
    try:
        employee = Employee.query.get(employee_id)

        if employee:
            employee_data = {
                'firstname': employee.firstname,
                'midint': employee.midint,
                'lastname': employee.lastname,
                'gender': employee.gender,
                'contact': employee.contact,
                'departmentname': employee.department.departmentName,
                'hiredate': employee.hiredate.strftime('%d-%m-%Y-'),
                'educationlevel': employee.educationlevel,
                'job': employee.job,
                'salary': employee.salary,
                'bonus': employee.bonus,
                'commission': employee.commission
            }
            response_data = {'status': 'success', 'employee': employee_data}
        else:
            response_data = {'status': 'error', 'message': 'Employee not found'}

        return jsonify(response_data)

    except Exception as e:
        response_data = {'status': 'error', 'message': str(e)}
        return jsonify(response_data)

# Retrieve and update employee's details
@app.route('/edit_employee/<int:employee_id>', methods=['GET', 'POST'])
def edit_employee(employee_id):
    try:
        employee = Employee.query.get(employee_id)

        if request.method == 'GET':
            if employee:
                return render_template('employee.html', employee=employee)
            else:
                return jsonify({'status': 'error', 'message': 'Employee not found'}), 404

        elif request.method == 'POST':
            if employee:
                try:
                    json_data = request.get_json()

                    if json_data:
                        hiredate_str = json_data.get('hiredate')
                        if hiredate_str:
                            employee.hiredate = datetime.strptime(hiredate_str, '%Y-%m-%d')

                        employee.firstname = json_data.get('firstname')
                        employee.midint = json_data.get('midint')
                        employee.lastname = json_data.get('lastname')
                        employee.gender = json_data.get('gender')
                        employee.contact = json_data.get('contact')

                        department_name = json_data.get('departmentname')
                        if department_name:
                            assignment =Assignment.query.filter_by(departmentName=department_name).first()
                            if assignment:
                                employee.assignment= assignmentt

                        employee.educationlevel = json_data.get('educationlevel')
                        employee.job = json_data.get('job')
                        employee.salary = json_data.get('salary')
                        employee.bonus = json_data.get('bonus')
                        employee.commission = json_data.get('commission')

                        db.session.commit()

                        return jsonify({'status': 'success', 'message': 'Employee updated successfully'}), 200
                    else:
                        return jsonify({'status': 'error', 'message': 'Invalid JSON data'}), 400
                except Exception as e:
                    return jsonify({'status': 'error', 'message': str(e)}), 500
            else:
                return jsonify({'status': 'error', 'message': 'Employee not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Delete an employee
@app.route('/delete_employee/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    try:
        employee = Employee.query.get(employee_id)

        if employee:
            db.session.delete(employee)
            db.session.commit()

            return jsonify({'status': 'success', 'message': 'Employee deleted successfully'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Employee not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# search for employees based on a specific criteria
@app.route('/search_employees', methods=['GET'])
def search_employees():
    try:
        # filter parameters
        filters = {
            'firstname': request.args.get('firstname', ''),
            'lastname': request.args.get('lastname', ''),
            'departmentname': request.args.get('departmentname', ''),
            'gender': request.args.get('gender', ''),
            'job': request.args.get('job', ''),
            'educationlevel': request.args.get('educationlevel', '')
        }

        query = Employee.query.filter_by(**filters)
        employees = query.all()

        # results
        employee_list = []
        for employee in employees:
            employee_data = {
                'firstname': employee.firstname,
                'lastname': employee.lastname
            }
            employee_list.append(employee_data)

        return jsonify({'status': 'success', 'employees': employee_list}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# fetching assignments
@app.route('/assignments', methods=['GET'])
def get_assignments():
    try:
        assignments= Assignment.query.all()

        department_list = []
        for assignment in assignments:
            assignment_data = {
                'departmentnumber': assignment.departmentnumber,
                'departmentName':assignment.departmentName,
                'departmentHead': assignment.departmentHead,
                'Location': assignment.Location
            }
            department_list.append(assignment_data)

        return jsonify({'status': 'success', 'departments': department_list}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# deleting a department
@app.route('/delete_department/<int:departmentnumber>', methods=['DELETE'])
def delete_department(departmentnumber):
    try:
        department = Department.query.get(departmentnumber)

        if department:
            # Delete the associated employees
            for employee in department.employees:
                db.session.delete(employee)

            # Delete the department
            db.session.delete(department)
            db.session.commit()

            return jsonify({'status': 'success', 'message': 'Department and associated employees deleted successfully'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Department not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Retrieve and update department's details
@app.route('/edit_department/<int:departmentNumber>', methods=['GET', 'POST'])
def edit_department(departmentNumber):
    try:
        department = Department.query.get(departmentNumber)

        if request.method == 'GET':
            if department:
                return render_template('department.html', department=department)
            else:
                return jsonify({'status': 'error', 'message': 'Department not found'}), 404

        elif request.method == 'POST':
            if department:
                try:
                    # Access form data using request.form
                    department.departmentName = request.form.get('departmentname')
                    department.departmentHead = request.form.get('departmenthead')
                    department.Location = request.form.get('location')

                    db.session.commit()

                    return jsonify({'status': 'success', 'message': 'Department updated successfully'}), 200
                except Exception as e:
                    return jsonify({'status': 'error', 'message': str(e)}), 500
            else:
                return jsonify({'status': 'error', 'message': 'Department not found'}), 404

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
