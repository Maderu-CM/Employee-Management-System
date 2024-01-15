from app import db, Employee, Department, app
from datetime import datetime
from faker import Faker

fake = Faker()

def create_fake_department(count=4):
    with app.app_context():
        for _ in range(count):
            department = Department(
                departmentnumber=fake.unique.random_number(6),
                departmentName=fake.company(),
                departmentHead=fake.name(),
                Location=fake.city()
            )
            db.session.add(department)
        db.session.commit()

def create_fake_employees(count=20):
    with app.app_context():
        for _ in range(count):
            employee = Employee(
                firstname=fake.first_name(),
                midint=fake.unique.random_number(4),
                lastname=fake.last_name(),
                gender=fake.random_element(elements=('Male', 'Female')),
                contact=fake.unique.random_number(10),
                departmentnumber=fake.random_number(6),
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
    create_fake_employees()
    print("Seeding completed successfully.")
