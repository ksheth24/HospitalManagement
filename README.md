# Hospital Management System
A full-stack hospital management platform designed to sreamline patient intake, medical staff workflows, and hospital record management using a React frontend and a Flask + MySQL backend.

## Database EERD
![Logo](images/EERD.png)

## Relational Schema
![Logo](images/SCHEMA.png)

## Database

This project uses MySQL for the relational data store. The database creation and stored-procedure files are included in this repo so reviewers can reproduce the schema and routines used by the app.

Files (place in `db/`):
- `db/schema.sql` — DDL to create the database, tables, indexes and initial seed data.
- `db/stored_procedures.sql` — All stored procedures and functions called by the backend.

**Make sure to run both these files first**

## Features
**Views**
1) An overview of patient room assignments: displays key relationships between patients, and their medical staff, and the departments overseeing their care.
2) An overview of patients appointments along with recorded symptoms.
3) Detailed information about medical staff.
4) Information about every department in the hospital.
5) View of the outstanding charges for all the patients in the hospital.

**Stored Procedures**
1) Add a new patient to the management system.
2) Record a new symptom for a patient, which will be used in an appointment.
3) Book a new appointment for a patient at a specific time and date.
4) Place a new order (lab work or perscription) for a patient as ordered by their doctor.
5) Add a staff member to a department.
6) Add funds to an existing patient.
7) Assign a nurse to a room, ensuring they are not over-booked.
8) Assign a patient to a room in the hospital, and ensures that the room is currently unoccupied.
9) Assign a doctor to an existing appointment.
10) Assign a staff member as the manager of a department.
11) Remove a patient from a given room.
12) Remove a patient from the hospital management system. 
13) Remove a staff member from a department.
14) Complete an appointment given its date, time, and patient SSN. 
15) Complete a certain number of perscription & labwork orders.

## Tech Stack
**Backend**
- Python, Flask
- MySQL (Locally Hosted)
- RESTful APIs

**FrontEnd**
- React, Node.js, JavaScript, CSS

**Tooling**
- GitHub, Git
- VS Code

## Architecture
The system followes a clean, layered architecture:

- Frontend handles user interaction and UI rendering
- Backend manages business logic and API endpoints
- Database ensures data integrity using constraints and stored procedures
- Request Flow: React UI -> Flask API -> MySQL -> Response

## Set Up
**Database Connection** 
```bash
cp .env.example .env
```
Then fill in the relavent fields

**Backend Setup**
```bash
cd flask_server
python main.py
```
Backend running on: http://127.0.0.1:5000

**Frontend Setup**
```bash
cd client
npm install
npm start
```
Frontend running on: http://localhost:3000/

## API Endpoints

## Engineer
**Keshav Sheth** 
B.S. Computer Engineering @ Georgia Tech '27
**Eshan Jain** 
B.S. Industrial & Systems Engineering @ Georgia Tech '27
**Ajay Desai** 
B.S. Computer Science @ Georgia Tech '27
