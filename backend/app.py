from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

load_dotenv('.flaskenv')

app = Flask(__name__)

# Configuration for SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)
CORS(app)

migrate = Migrate(app, db)

# Models
class Employee(db.Model):
    __tablename__ = 'employee'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    firstname = db.Column(db.String(30), nullable=False)
    lastname = db.Column(db.String(30), nullable=False)
    dateOfBirth = db.Column(db.DateTime, nullable=False)
    gender = db.Column(db.String(30), nullable=False)
    contact = db.Column(db.String(20), unique=True, nullable=False)
    identification_number = db.Column(db.Integer,nullable=False)
    department_number = db.Column(db.Integer, db.ForeignKey('assignment.departmentnumber'), nullable=False)
    dateOfEmployment = db.Column(db.DateTime, nullable=False)
    contractPeriod = db.Column(db.Integer, nullable=False)
    job = db.Column(db.String, nullable=False)

    # Define the relationship with cascade
    documents = db.relationship('Document', backref='employee', lazy=True, cascade='all, delete-orphan')

class Assignment(db.Model):
    __tablename__ = 'assignment'

    departmentnumber = db.Column(db.Integer, primary_key=True, nullable=False)
    departmentName = db.Column(db.String, nullable=False)
    departmentHead = db.Column(db.String, nullable=False)
    Location = db.Column(db.String, nullable=False)

    # relationship
    employees = db.relationship('Employee', backref='assignment', lazy=True, cascade='all, delete-orphan')

class Document(db.Model):
    __tablename__ = 'document'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id', ondelete='CASCADE'), nullable=False)
    passport_filepath = db.Column(db.String, nullable=False)
    IdCopy_filepath = db.Column(db.String, nullable=False)
    ChiefLetter_filepath = db.Column(db.String, nullable=False)
    ClearanceLetter_filepath = db.Column(db.String, nullable=False)
    Reference_filepath = db.Column(db.String)

import routes

if __name__ == '__main__':
    app.run(debug=True)
