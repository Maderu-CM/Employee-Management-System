from app import db, Employee, Department, app
from datetime import datetime
from faker import Faker

fake = Faker()

def create_fake_department(count=6):
    with app.app_context():
     
        departments_data = [
            {'name': 'Guard', 'number': 1},
            {'name': 'Garage', 'number': 2},
            {'name': 'Finance', 'number': 3},
            {'name': 'Sales', 'number': 4},
            {'name': 'Human Resource', 'number': 5},
            {'name': 'Procurement', 'number': 6},
        ]

        for dept_data in departments_data:
            department = Department(
                departmentnumber=dept_data['number'],
                departmentName=dept_data['name'],
                departmentHead=fake.name(),
                Location=fake.city()
            )
            db.session.add(department)
        
        db.session.commit()

def create_fake_employee(count=20):
    with app.app_context():
      
        department_numbers = [1, 2, 3, 4, 5, 6]

        for _ in range(count):
            firstname = fake.first_name()
            lastname = fake.last_name()
            midint = f"{firstname[0]}{lastname[0]}"

            employee = Employee(
                firstname=firstname,
                midint=midint,
                lastname=lastname,
                gender=fake.random_element(elements=('Male', 'Female')),
                contact=fake.unique.random_number(10),
                departmentnumber=fake.random_element(elements=department_numbers),
                hiredate=fake.date_time(),
                educationlevel=fake.random_element(elements=('Bachelor', 'Master', 'PhD')),
                job=fake.job(),
                salary=fake.random_int(30000, 80000),
                bonus=fake.random_int(1000, 5000),
                commission=fake.random_int(500, 2000)
            )
            db.session.add(employee)
        
        db.session.commit()

if __name__ == "__main__":
    create_fake_department()
    create_fake_employee()
    print("Seeding completed successfully.")
