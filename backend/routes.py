from flask import Flask, render_template, request, redirect, url_for, jsonify
from app import db, Employee, Department, app
from flask_cors import CORS



from datetime import datetime


CORS(app)




app.config['JWT_SECRET_KEY'] = 'kjsfhiuyrnAUTdjhddjlkjfeadDAlHgDM'


# Adding an employee
@app.route('/add_employee', methods=['POST'])
def add_employee():
    try:
        data = request.get_json()

        
        firstname = data.get('firstname')
        midint = data.get('midint')  
        lastname = data.get('lastname')
        gender = data.get('gender')
        contact = data.get('contact')
        departmentnumber = data.get('departmentnumber')
        hiredate_str = data.get('hiredate')
        educationlevel = data.get('educationlevel')
        job = data.get('job')
        salary = data.get('salary')
        bonus = data.get('bonus')
        commission = data.get('commission')

        
        hiredate = datetime.fromisoformat(hiredate_str)

       
        new_employee = Employee(
            firstname=firstname,
            midint=midint,
            lastname=lastname,
            gender=gender,
            contact=contact,
            departmentnumber=departmentnumber,
            hiredate=hiredate,
            educationlevel=educationlevel,
            job=job,
            salary=salary,
            bonus=bonus,
            commission=commission
        )

        e
        db.session.add(new_employee)
        db.session.commit()

        return jsonify({'message': 'New Employee added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#Add a department
@app.route('/add_department', methods=['POST'])
def add_department():
    try:
        data = request.get_json()

       
        departmentName= data.get('departmentName')
        departmentHead = data.get('departmentHead')  
        Location = data.get('Location')

        new_department= Department(
            departmentName=departmentName,
            departmentHead=departmentHead,
            Location=Location
          
        )

        db.session.add(new_department)
        db.session.commit()

        return jsonify({'message': 'New Department added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
#view employees 
@app.route('/employees', methods=['GET'])
def view_employees():
    try:
        employees = Employee.query.all()

        employee_list = []
        for employee in employees:
            employee_data = {
                
                'firstname': employee.firstname,
                'midint': employee.midint,
                'lastname': employee.lastname,
                'contact': employee.contact
            }
            employee_list.append(employee_data)

        response_data = {'status': 'success', 'employees': employee_list}
        return jsonify(response_data)
    
    except Exception as e:
        response_data = {'status': 'error', 'message': str(e)}
        return jsonify(response_data)
    
#view details of a specific user.
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
    
#Retrieve and update employee's details
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
                        # Convert hiredate string to datetime object
                        hiredate_str = json_data.get('hiredate')
                        if hiredate_str:
                            employee.hiredate = datetime.strptime(hiredate_str, '%Y-%m-%d')

                        # Update other fields
                        employee.firstname = json_data.get('firstname')
                        employee.midint = json_data.get('midint')
                        employee.lastname = json_data.get('lastname')
                        employee.gender = json_data.get('gender')
                        employee.contact = json_data.get('contact')

                        # Access departmentName through the relationship
                        department_name = json_data.get('departmentname')
                        if department_name:
                            department = Department.query.filter_by(departmentName=department_name).first()
                            if department:
                                employee.department = department

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
    
#Delete an employee
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
    
#search for employees based on a specific criteria
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


#fetching departments
@app.route('/departments', methods=['GET'])
def get_departments():
    try:
       
        departments = Department.query.all()

        department_list = [{'departmentnumber': department.departmentnumber, 'departmentName': department.departmentName} for department in departments]

        return jsonify({'status': 'success', 'departments': department_list}), 200
    except Exception as e:
        
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
    #deleting a department
@app.route('/delete_department/<int:departmentNumber>', methods=['DELETE'])
def delete_department(departmentNumber):
    try:
        department = Department.query.get(departmentNumber)

        if department:
            db.session.delete(department)
            db.session.commit()

            return jsonify({'status': 'success', 'message': 'Department deleted successfully'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Department not found'}), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
#Retrieve and update department's details
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