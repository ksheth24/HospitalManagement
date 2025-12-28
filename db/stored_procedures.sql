
-- CS4400: Introduction to Database Systems: Monday, October 13, 2025
-- ER Management System Stored Procedures & Views Template [1]

/* This is a standard preamble for most of our scripts.  The intent is to establish
a consistent environment for the database behavior. */
set global transaction isolation level serializable;
set global SQL_MODE = 'ANSI,TRADITIONAL';
set session SQL_MODE = 'ANSI,TRADITIONAL';
set names utf8mb4;
set SQL_SAFE_UPDATES = 0;

set @thisDatabase = 'er_hospital_management';
use er_hospital_management;

-- Supporting views (helper functions)
create or replace view patient_nurse as
SELECT pat.ssn as 'patient', a.nurseID as 'nurse', p.firstName as 'nurse_fname', p.lastName as 'nurse_lname' from patient pat JOIN room r ON pat.ssn = r.occupiedBy JOIN room_assignment a ON r.roomNumber = a.roomNumber JOIN person p ON a.nurseID = p.ssn;

create or replace view patient_doctor as
SELECT pat.ssn as 'patientID', a.doctorID as 'doctor', p.firstName as 'doctor_fname', p.lastName as 'doctor_lname' FROM patient pat JOIN appt_assignment a ON pat.ssn = a.patientID JOIN person p ON a.doctorID = p.ssn;


-- -------------------
-- Views
-- -------------------

-- [1] room_wise_view()
-- -----------------------------------------------------------------------------
/* This view provides an overview of patient room assignments, including the patients’ 
first and last names, room numbers, managing department names, assigned doctors' first and 
last names (through appointments), and nurses' first and last names (through room). 
It displays key relationships between patients, their assigned medical staff, and 
the departments overseeing their care. Note that there will be a row for each combination 
of assigned doctor and assigned nurse.*/
-- -----------------------------------------------------------------------------
create or replace view room_wise_view as
SELECT per.firstName AS 'patient_fname', per.lastName AS 'patient_lname', r.roomNumber AS 'room_num', dept.longName AS 'department_name', d.doctor_fname, d.doctor_lname, n.nurse_fname, n.nurse_lname FROM patient pat JOIN person per ON pat.ssn = per.ssn 
LEFT JOIN patient_doctor d ON pat.ssn = d.patientID JOIN patient_nurse n ON pat.ssn = n.patient JOIN room r ON pat.ssn = r.occupiedBy JOIN department dept ON r.managingDept = dept.deptID;

-- [2] symptoms_overview_view()
-- -----------------------------------------------------------------------------
/* This view provides a comprehensive overview of patient appointments
along with recorded symptoms. Each row displays the patient’s SSN, their full name 
(HINT: the CONCAT function can be useful here), the appointment time, appointment date, 
and a list of symptoms recorded during the appointment with each symptom separated by a 
comma and a space (HINT: the GROUP_CONCAT function can be useful here). */
-- -----------------------------------------------------------------------------
create or replace view symptoms_overview_view as
SELECT p.ssn AS 'Patient SSN', CONCAT(p.firstName, ' ', p.lastName) AS 'Patient Name', a.apptDate AS 'Appointment Date', a.apptTime AS 'Appointment Time', GROUP_CONCAT(distinct symptomType SEPARATOR ', ') AS 'Symptoms' 
FROM appointment a JOIN person p ON a.patientID = p.ssn JOIN symptom s ON s.patientID = a.patientID and s.apptDate = a.apptDate and s.apptTime = a.apptTime GROUP BY s.patientID, s.apptDate, s.apptTime;

-- [3] medical_staff_view()
-- -----------------------------------------------------------------------------
/* This view displays information about medical staff. For every nurse and doctor, it displays
their ssn, their "staffType" being either "nurse" or "doctor", their "licenseInfo" being either
their licenseNumber or regExpiration, their "jobInfo" being either their shiftType or 
experience, a list of all departments they work in in alphabetical order separated by a
comma and a space (HINT: the GROUP_CONCAT function can be useful here), and their "numAssignments" 
being either the number of rooms they're assigned to or the number of appointments they're assigned to. */
-- -----------------------------------------------------------------------------
create or replace view medical_staff_view as
select d.ssn AS 'staffSsn', 'doctor' AS 'staffType', d.licenseNumber AS 'licenseInfo', d.experience AS 'jobInfo', GROUP_CONCAT(distinct dept.longName ORDER BY dept.longName separator ', ') AS 'deptNames', COUNT(doctorId) AS 'numAssignments' FROM doctor d JOIN works_in w ON d.ssn = w.staffSsn JOIN department dept ON w.deptId = dept.deptId JOIN appt_assignment a ON d.ssn = a.doctorId GROUP BY d.ssn
UNION
select n.ssn AS 'staffSsn', 'nurse' AS 'staffType', n.regExpiration AS 'licenseInfo', n.shiftType AS 'jobInfo', GROUP_CONCAT(distinct d.longName ORDER BY d.longName separator ', ') AS 'deptNames', COUNT(r.roomNumber) AS 'numAssignments' FROM nurse n JOIN works_in w ON n.ssn = w.staffSsn JOIN department d ON w.deptId = d.deptId JOIN room_assignment r ON n.ssn = r.nurseId GROUP BY n.ssn;


-- [4] department_view()
-- -----------------------------------------------------------------------------
/* This view displays information about every department in the hospital. The information
displayed should be the department's long name, number of total staff members, the number of 
doctors in the department, and the number of nurses in the department. If a department does not 
have any doctors/nurses/staff members, ensure the output for those columns is zero, not null */
-- -----------------------------------------------------------------------------
create or replace view department_view as
select dept.longName as department_name, count (W.staffSsn) as staff_members, count (doctor.ssn) as num_doctors, count (nurse.ssn) as num_nurses from department as dept left join works_in as w on dept.deptId = w.deptId
left join doctor as doctor on w.staffSsn = doctor.ssn
left join nurse as nurse on w.staffSsn = nurse.ssn
group by dept.longName;

-- helper views:
create or replace view appointment_stats as 
select p.ssn, ifnull(sum(cost), 0) as 'a_cost', ifnull(count(apptDate), 0) as 'appointment_count' from patient p left join appointment a on p.ssn = a.patientId group by p.ssn;

create or replace view order_stats as 
select p.ssn, ifnull(sum(cost), 0) as 'o_cost', ifnull(count(orderNumber), 0) as 'order_count' from patient p left join med_order o on p.ssn = o.patientId group by p.ssn;


-- [5] outstanding_charges_view()
-- -----------------------------------------------------------------------------
/* This view displays the outstanding charges for the patients in the hospital. 
“Outstanding charges” is the sum of appointment costs and order costs. It also 
displays a patient’s first name, last name, SSN, funds, number of appointments, 
and number of orders. Ensure there are no null values if there are no charges, 
appointments, orders for a patient (HINT: the IFNULL or COALESCE functions can be 
useful here).  */
-- -----------------------------------------------------------------------------
create or replace view outstanding_charges_view as
select per.firstName as 'fname', per.lastName as 'lname', p.ssn, p.funds, a.a_cost + o.o_cost as 'outstanding_costs', a.appointment_count, o.order_count 
from patient p join person per on p.ssn = per.ssn join appointment_stats a on p.ssn = a.ssn join order_stats o on p.ssn = o.ssn;


-- -------------------
-- Stored Procedures
-- -------------------

-- [6] add_patient()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new patient. If the new patient does 
not exist in the person table, then add them prior to adding the patient. 
Ensure that all input parameters are non-null, and that a patient with the given 
SSN does not already exist. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_patient;
delimiter /​/
create procedure add_patient (
	in ip_ssn varchar(40),
    in ip_first_name varchar(100),
    in ip_last_name varchar(100),
    in ip_birthdate date,
    in ip_address varchar(200), 
    in ip_funds integer,
    in ip_contact char(12)
)
sp_main: begin
If ip_ssn is NULL or ip_first_name is NULL or ip_last_name is NULL or ip_birthdate is NULL or ip_address is NULL or ip_funds is NULL or ip_contact is NULL then leave sp_main; end if;

if ip_ssn in (select ssn from patient) then leave sp_main; end if; -- if its in both then leave

if ip_funds < 0 then leave sp_main; end if;

if ip_ssn in (select ssn from person) then 
Insert into patient values (ip_ssn, ip_funds, ip_contact); leave sp_main; end if; -- if its in person then add to patient since we know from before its not in patient


Insert into person values (ip_ssn, ip_first_name, ip_last_name, ip_birthdate, ip_address); -- its in neither so add to both
Insert into patient values (ip_ssn, ip_funds, ip_contact);

end /​/
delimiter ;

-- [7] record_symptom()
-- -----------------------------------------------------------------------------
/* This stored procedure records a new symptom for a patient. Ensure that all input 
parameters are non-null, and that the referenced appointment exists for the given 
patient, date, and time. Ensure that the same symptom is not already recorded for 
that exact appointment. */
-- -----------------------------------------------------------------------------
drop procedure if exists record_symptom;
delimiter /​/
create procedure record_symptom (
	in ip_patientId varchar(40),
    in ip_numDays int,
    in ip_apptDate date,
    in ip_apptTime time,
    in ip_symptomType varchar(100)
)
sp_main: begin
	if ip_patientId is not null and ip_numDays is not null and ip_apptDate is not null 
    and ip_apptTime is not null and ip_symptomType is not null 
    and exists (select * from appointment where ip_patientId = patientId and ip_apptDate = apptDate and 
    ip_apptTime = apptTime) 
    and not exists (select * from symptom where ip_symptomType = symptomType and ip_numDays = numDays
    and ip_patientId = patientId and ip_apptDate = apptDate and ip_apptTime = apptTime)
    then
	insert into symptom (symptomType, numDays, patientId, apptDate, apptTime) 
    values (ip_symptomType, ip_numDays, ip_patientId, ip_apptDate, ip_apptTime);
    end if;
end /​/
delimiter ;

-- [8] book_appointment()
-- -----------------------------------------------------------------------------
/* This stored procedure books a new appointment for a patient at a specific time and date.
The appointment date/time must be in the future (the CURDATE() and CURTIME() functions will
be helpful). The patient must not have any conflicting appointments and must have the funds
to book it on top of any outstanding costs. Each call to this stored procedure must add the 
relevant data to the appointment table if conditions are met. Ensure that all input parameters 
are non-null and reference an existing patient, and that the cost provided is non‑negative. 
Do not charge the patient, but ensure that they have enough funds to cover their current outstanding 
charges and the cost of this appointment.
HINT: You should complete outstanding_charges_view before this procedure! */
-- -----------------------------------------------------------------------------
drop procedure if exists book_appointment;
delimiter /​/
create procedure book_appointment (
	in ip_patientId char(11),
	in ip_apptDate date,
    in ip_apptTime time,
	in ip_apptCost integer
)
sp_main: begin
	if ip_patientId is not null and ip_apptDate is not null and ip_apptTime is not null and ip_apptCost is not null and
    exists (select * from patient where ip_patientId = ssn) and
    not exists (select * from appointment where ip_patientId = patientId and ip_apptDate = apptDate and ip_apptTime = apptTime) and
    ip_apptCost >= 0 and (select funds from patient where ip_patientId = ssn) - 
    (select outstanding_costs from outstanding_charges_view where ip_patientId = ssn) >= ip_apptCost then
    if ip_apptDate > curdate() or ip_apptDate = curdate() and ip_apptTime > curtime() then
    insert into appointment (patientId, apptDate, apptTime, cost)
    values (ip_patientId, ip_apptDate, ip_apptTime, ip_apptCost);
    end if;
    end if;
end /​/
delimiter ;

-- [9] place_order()
-- -----------------------------------------------------------------------------
/* This stored procedures places a new order for a patient as ordered by their
doctor. The patient must also have enough funds to cover the cost of the order on 
top of any outstanding costs. Each call to this stored procedure will represent 
either a prescription or a lab report, and the relevant data should be added to the 
corresponding table. Ensure that the order-specific, patient-specific, and doctor-specific 
input parameters are non-null, and that either all the labwork specific input parameters are 
non-null OR all the prescription-specific input parameters are non-null (i.e. if ip_labType 
is non-null, ip_drug and ip_dosage should both be null).
Ensure the inputs reference an existing patient and doctor. 
Ensure that the order number is unique for all orders and positive. Ensure that a cost 
is provided and non‑negative. Do not charge the patient, but ensure that they have 
enough funds to cover their current outstanding charges and the cost of this appointment. 
Ensure that the priority is within the valid range. If the order is a prescription, ensure 
the dosage is positive. Ensure that the order is never recorded as both a lab work and a prescription.
The order date inserted should be the current date, and the previous procedure lists a function that
will be required to use in this procedure as well.
HINT: You should complete outstanding_charges_view before this procedure! */
-- -----------------------------------------------------------------------------
drop procedure if exists place_order;
delimiter /​/
create procedure place_order (
	in ip_orderNumber int, 
	in ip_priority int,
    in ip_patientId char(11), 
	in ip_doctorId char(11),
    in ip_cost integer,
    in ip_labType varchar(100),
    in ip_drug varchar(100),
    in ip_dosage int
)
sp_main: begin
If ip_orderNumber is NULL or ip_priority is NULL or ip_patientId is NULL or ip_doctorId is NULL or ip_cost is NULL then leave sp_main; end if;

-- checks to make sure it's only either a prescription or lab work
if ip_labType is not null and (ip_drug is not null or ip_dosage is not null) then leave sp_main; end if;

if ip_labType is null and (ip_drug is null or ip_dosage is null) then leave sp_main; end if;


-- checks to make sure we’re referencing valid doctors and patients
if ip_patientId not in (select ssn from patient) then leave sp_main; end if;

If ip_doctorId not in (select ssn from doctor) then leave sp_main; end if;

-- checks to make sure orderNumber doesn’t exist already and that it’s positive
If ip_orderNumber in (select orderNumber from lab_work) or ip_orderNumber in (select orderNumber from prescription) or ip_orderNumber < 0 then leave sp_main; end if;

-- check to see if cost is non-negative
If ip_cost < 0 then leave sp_main; end if;

-- check to see if patients have enough money to cover this cost and their outstanding charges
if (select funds from outstanding_charges_view where ssn = ip_patientId) < ip_cost + (select outstanding_costs from outstanding_charges_view where ssn = ip_patientId) then leave sp_main; end if;

-- check to see if priority is valid
if ip_priority not between 1 and 5 then leave sp_main; end if;

-- if the order is prescription, ensure the dosage is positive
if ip_labType is Null and ip_dosage <= 0 then leave sp_main; end if;


Insert into med_order values (ip_orderNumber, CURDATE(), ip_priority, ip_patientId, ip_doctorId, ip_cost);

If ip_labType is not NULL then insert into lab_work values (ip_orderNumber, ip_labType); end if;

If ip_drug is not NULL and ip_dosage is not NULL then insert into prescription values (ip_orderNumber, ip_drug, ip_dosage); end if;

end /​/
delimiter ;

-- [10] add_staff_to_dept()
-- -----------------------------------------------------------------------------
/* This stored procedure adds a staff member to a department. If they are already
a staff member and not a manager for a different department, they can be assigned
to this new department. If they are not yet a staff member or person, they can be 
assigned to this new department and all other necessary information should be 
added to the database. Ensure that all input parameters are non-null and that the 
Department ID references an existing department. Ensure that the staff member is 
not already assigned to the department. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_staff_to_dept;
delimiter /​/
create procedure add_staff_to_dept (
	in ip_deptId integer,
    in ip_ssn char(11),
    in ip_firstName varchar(100),
	in ip_lastName varchar(100),
    in ip_birthdate date,
    in ip_startdate date,
    in ip_address varchar(200),
    in ip_staffId integer,
    in ip_salary integer
)
sp_main: begin
	if ip_deptId is not null and ip_ssn is not null and ip_firstName is not null and ip_lastName is not null
    and ip_birthdate is not null and ip_startdate is not null and ip_address is not null and
    ip_staffId is not null and ip_salary is not null and 
    exists (select * from department where ip_deptId = deptId)
    then
	if exists (select * from staff where ip_ssn = ssn) and
    not exists (select * from works_in where ip_deptId = deptId) and
    not exists (select * from department where ip_ssn = manager) and
    exists (select * from department where ip_deptId = deptId) then
    insert into works_in (staffSsn, deptId) values (ip_ssn, ip_deptId);
    end if;
	if not exists (select * from person where ip_ssn = ssn) and
    exists (select * from department where ip_deptId = deptId) then
    insert into person (ssn, firstName, lastName, birthdate, address) 
    values (ip_ssn, ip_firstName, ip_lastName, ip_birthdate, ip_address);
    end if;
    if not exists (select * from staff where ip_ssn = ssn) and
    exists (select * from department where ip_deptId = deptId) then
    insert into staff (ssn, staffId, hireDate, salary) values (ip_ssn, ip_staffId, ip_startdate, ip_salary);
    insert into works_in (staffSsn, deptId) values (ip_ssn, ip_deptId);
    end if;
    end if;
end /​/
delimiter ;

-- [11] add_funds()
-- -----------------------------------------------------------------------------
/* This stored procedure adds funds to an existing patient. The amount of funds
added must be positive. Ensure that all input parameters are non-null and reference 
an existing patient. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_funds;
delimiter /​/
create procedure add_funds (
	in ip_ssn char(11),
    in ip_funds integer
)
sp_main: begin
	declare currentFunds integer;
	if ip_ssn is null or ip_funds is null then
		leave sp_main; 
	elseif ip_funds <= 0 then 
		leave sp_main;
	elseif ip_ssn not in (select ssn from patient) then
		leave sp_main;
	end if;
	select p.funds into currentFunds from patient p where p.ssn = ip_ssn;
    update patient n set funds = currentFunds + ip_funds where n.ssn = ip_ssn;
end /​/
delimiter ;

-- [12] assign_nurse_to_room()
-- -----------------------------------------------------------------------------
/* This stored procedure assigns a nurse to a room. In order to ensure they
are not over-booked, a nurse cannot be assigned to more than 4 rooms. Ensure that 
all input parameters are non-null and reference an existing nurse and room. */
-- -----------------------------------------------------------------------------
drop procedure if exists assign_nurse_to_room;
delimiter /​/
create procedure assign_nurse_to_room (
	in ip_nurseId char(11),
    in ip_roomNumber integer
)
sp_main: begin
If ip_nurseId is NULL or ip_roomNumber is NULL then leave sp_main; end if;

if ip_nurseId not in (select ssn from Nurse) then leave sp_main; end if;

If ip_roomNumber not in (select roomNumber from Room) then leave sp_main; end if;

If ip_nurseId in (select nurseId from room_assignment group by nurseId having count(nurseId) >=4 ) then leave sp_main; end if;

Insert into room_assignment values (ip_roomNumber, ip_nurseId);

end /​/
delimiter ;

-- [13] assign_room_to_patient()
-- -----------------------------------------------------------------------------
/* This stored procedure assigns a room to a patient. The room must currently be
unoccupied. If the patient is currently assigned to a different room, they should 
be removed from that room. To ensure that the patient is placed in the correct type 
of room, we must also confirm that the provided room type matches that of the 
provided room number. Ensure that all input parameters are non-null and reference 
an existing patient and room. */
-- -----------------------------------------------------------------------------
drop procedure if exists assign_room_to_patient;
delimiter /​/
create procedure assign_room_to_patient (
    in ip_ssn char(11),
    in ip_roomNumber int,
    in ip_roomType varchar(100)
)
sp_main: begin
    if ip_ssn is not null and ip_roomNumber is not null and ip_roomType is not null and
    exists (select * from patient where ip_ssn = ssn) and
    exists (select * from room where ip_roomNumber = roomNumber and ip_roomType = roomType) then
    if exists (select * from room where ip_ssn = occupiedBy) then
    update room set occupiedBy = null where ip_ssn = occupiedBy;
    end if;
    if exists (select * from room where ip_roomNumber = roomNumber and occupiedBy is null) then
    update room set occupiedBy = ip_ssn where ip_roomNumber = roomNumber and occupiedBy is null;
    end if;
    end if;
end /​/
delimiter ;

-- [14] assign_doctor_to_appointment()
-- -----------------------------------------------------------------------------
/* This stored procedure assigns a doctor to an existing appointment. Ensure that no
more than 3 doctors are assigned to an appointment, and that the doctor does not
have commitments to other patients at the exact appointment time. Ensure that all input 
parameters are non-null and reference an existing doctor and appointment. */
-- -----------------------------------------------------------------------------
drop procedure if exists assign_doctor_to_appointment;
delimiter /​/
create procedure assign_doctor_to_appointment (
	in ip_patientId char(11),
    in ip_apptDate date,
    in ip_apptTime time,
    in ip_doctorId char(11)
)
sp_main: begin
	if ip_patientId is null or ip_apptDate is null or ip_apptTime is null or ip_doctorId is null then 
		leave sp_main;
	elseif ip_patientId not in (select ssn from patient) then 
		leave sp_main;
	elseif ip_doctorId not in (select ssn from doctor) then
		leave sp_main;
	elseif ip_doctorId in (select doctorID from appt_assignment where doctorID = ip_doctorId and apptDate = ip_apptDate and apptTime = ip_apptTime) then 
		leave sp_main;
	elseif (ip_patientId, ip_apptDate, ip_apptTime) in (SELECT a.patientId, a.apptDate, a.apptTime from appt_assignment a group by a.patientId, a.apptDate, a.apptTime having count(doctorID) >= 3) then
		leave sp_main;
	elseif not exists (select * from appointment where patientId = ip_patientId and apptDate = ip_apptDate and apptTime = ip_apptTime) then
		leave sp_main;
	end if;
	insert into appt_assignment (patientId, apptDate, apptTime, doctorId) values (ip_patientId, ip_apptDate, ip_apptTime, ip_doctorId);
end /​/
delimiter ;

-- [15] manage_department()
-- -----------------------------------------------------------------------------
/* This stored procedure assigns a staff member as the manager of a department.
The staff member cannot currently be the manager for any departments. They
should be removed from working in any departments except the given
department (make sure the staff member is not the sole employee for any of these 
other departments, as they cannot leave and be a manager for another department otherwise),
for which they should be set as its manager. Ensure that all input parameters are non-null 
and reference an existing staff member and department.
*/
-- -----------------------------------------------------------------------------
drop procedure if exists manage_department;
delimiter /​/
create procedure manage_department (
	in ip_ssn char(11),
    in ip_deptId int
)
sp_main: begin
If ip_ssn is NULL or ip_deptId is NULL then leave sp_main; end if; -- null checks

If ip_ssn not in (select ssn from staff) then leave sp_main; end if;  -- check if staff member exists

if ip_deptId not in (select deptId from department) then leave sp_main; end if; -- check if department exists

if ip_ssn in (select manager from department) then leave sp_main; end if; -- check if the person is already a manager

-- check if this employee is working in any department where they are the only employee
if ip_ssn in (select w.StaffSsn from works_in as w where ip_ssn = w.StaffSsn and w.deptId in (select w1.deptId from works_in as w1 group by w1.deptId having count(*) = 1)) then leave sp_main; end if; 

-- check if they work in the target department. if not, then add them: 
if ip_deptId not in (select deptId from works_in where StaffSsn = ip_ssn) then 
insert into works_in values (ip_ssn, ip_deptId); end if;

-- we can now safely remove them from other departments
Delete from works_in where StaffSsn = ip_ssn and deptId not in (select deptId from department where deptId = ip_deptId);

-- we can now promote them to manager of that department
Update department set manager = ip_ssn where deptId = ip_deptId;

end /​/
delimiter ;

-- [16] release_room()
-- -----------------------------------------------------------------------------
/* This stored procedure removes a patient from a given room. Ensure that 
the input room number is non-null and references an existing room.  */
-- -----------------------------------------------------------------------------
drop procedure if exists release_room;
delimiter /​/
create procedure release_room (
    in ip_roomNumber int
)
sp_main: begin
	if ip_roomNumber is not null and exists (select * from room where ip_roomNumber = roomNumber) then
    update room set occupiedBy = null where ip_roomNumber = roomNumber;
    end if;
end /​/
delimiter ;

-- [17] remove_patient()
-- -----------------------------------------------------------------------------
/* This stored procedure removes a given patient. If the patient has any pending
orders or remaining appointments (regardless of time), they cannot be removed.
If the patient is not a staff member, they then must be completely removed from 
the database. Ensure all data relevant to this patient is removed. Ensure that the 
input SSN is non-null and references an existing patient. */
-- -----------------------------------------------------------------------------
drop procedure if exists remove_patient;
delimiter /​/
create procedure remove_patient (
	in ip_ssn char(11)
)
sp_main: begin
	if ip_ssn is null or ip_ssn not in (SELECT ssn FROM patient) then
		leave sp_main;
	elseif ip_ssn in (SELECT patientId from appt_assignment) then
		leave sp_main;
	elseif ip_ssn in (SELECT patientId from med_order) then 
		leave sp_main;
	elseif ip_ssn in (SELECT ssn from staff) then 
		leave sp_main;
	else 
		delete from person where ssn = ip_ssn;
        delete from patient where ssn = ip_ssn;
	end if;
end /​/
delimiter ;

-- remove_staff()
-- Lucky you, we provided this stored procedure to you because it was more complex
-- than we would expect you to implement. You will need to call this procedure
-- in the next procedure!
-- -----------------------------------------------------------------------------
/* This stored procedure removes a given staff member. If the staff member is a 
manager, they are not removed. If the staff member is a nurse, all rooms
they are assigned to have a remaining nurse if they are to be removed. 
If the staff member is a doctor, all appointments they are assigned to have
a remaining doctor and they have no pending orders if they are to be removed.
If the staff member is not a patient, then they are completely removed from 
the database. All data relevant to this staff member is removed. */
-- -----------------------------------------------------------------------------
drop procedure if exists remove_staff;
delimiter /​/
create procedure remove_staff (
	in ip_ssn char(11)
)
sp_main: begin
	-- ensure parameters are not null
    if ip_ssn is null then
		leave sp_main;
	end if;
    
	-- ensure staff member exists
	if not exists (select ssn from staff where ssn = ip_ssn) then
		leave sp_main;
	end if;
	
    -- if staff member is a nurse
    if exists (select ssn from nurse where ssn = ip_ssn) then
	if exists (
		select 1
		from (
			 -- Get all rooms assigned to the nurse
			 select roomNumber
			 from room_assignment
			 where nurseId = ip_ssn
		) as my_rooms
		where not exists (
			 -- Check if there is any other nurse assigned to that room
			 select 1
			 from room_assignment 
			 where roomNumber = my_rooms.roomNumber
			   and nurseId <> ip_ssn
		)
	)
	then
		leave sp_main;
	end if;
		
        -- remove this nurse from room_assignment and nurse tables
		delete from room_assignment where nurseId = ip_ssn;
		delete from nurse where ssn = ip_ssn;
	end if;
	
    -- if staff member is a doctor
	if exists (select ssn from doctor where ssn = ip_ssn) then
		-- ensure the doctor does not have any pending orders
		if exists (select * from med_order where doctorId = ip_ssn) then 
			leave sp_main;
		end if;
		
		-- ensure all appointments assigned to this doctor have remaining doctors assigned
		if exists (
		select 1
		from (
			 -- Get all appointments assigned to ip_ssn
			 select patientId, apptDate, apptTime
			 from appt_assignment
			 where doctorId = ip_ssn
		) as ip_appointments
		where not exists (
			 -- For the same appointment, check if there is any other doctor assigned
			 select 1
			 from appt_assignment 
			 where patientId = ip_appointments.patientId
			   and apptDate = ip_appointments.apptDate
			   and apptTime = ip_appointments.apptTime
			   and doctorId <> ip_ssn
		)
	)
	then
		leave sp_main;
	end if;
        
		-- remove this doctor from appt_assignment and doctor tables
		delete from appt_assignment where doctorId = ip_ssn;
		delete from doctor where ssn = ip_ssn;
	end if;
    
    -- remove staff member from works_in and staff tables
    delete from works_in where staffSsn = ip_ssn;
    delete from staff where ssn = ip_ssn;

	-- ensure staff member is not a patient
	if exists (select * from patient where ssn = ip_ssn) then 
		leave sp_main;
	end if;
    
    -- remove staff member from person table
	delete from person where ssn = ip_ssn;
end /​/
delimiter ;

-- [18] remove_staff_from_dept()
-- -----------------------------------------------------------------------------
/* This stored procedure removes a staff member from a department. If the staff
member is the manager of that department, they cannot be removed. If the staff
member, after removal, is no longer working for any departments, they should then 
also be removed as a staff member, following all logic in the remove_staff procedure. 
Ensure that all input parameters are non-null and that the given person works for
the given department. Ensure that the department will have at least one staff member 
remaining after this staff member is removed. */
-- -----------------------------------------------------------------------------
drop procedure if exists remove_staff_from_dept;
delimiter /​/
create procedure remove_staff_from_dept (
	in ip_ssn char(11),
    in ip_deptId integer
)
sp_main: begin
if ip_ssn is NULL or ip_deptId is NULL then leave sp_main; end if; -- null checks

if ip_deptId not in (select deptId from works_in where staffSsn = ip_ssn) then leave sp_main; end if; -- check if the given person actually works for the given department

-- check that the department has at least two distinct employees working in it to make removal safe
if (select count(distinct staffSsn) from works_in  where deptId = ip_deptId) <= 1 then leave sp_main; end if;

-- make sure the person is not the manager of that department
if ip_ssn in (select manager from department where deptId = ip_deptId) then leave sp_main; end if;

delete from works_in where staffSsn = ip_ssn and deptId  = ip_deptId;

-- check to see if this person still works for a department. If they don’t, we need to call the remove_staff procedure to remove them all the other stuff
if ip_ssn not in (select staffSsn from works_in) then
call remove_staff(ip_ssn); end if;

end /​/
delimiter ;

-- [19] complete_appointment()
-- -----------------------------------------------------------------------------
/* This stored procedure completes an appointment given its date, time, and patient SSN.
The completed appointment and any related information should be removed 
from the system, and the patient should be charged accordingly. Ensure that all 
input parameters are non-null and that they reference an existing appointment. */
-- -----------------------------------------------------------------------------
drop procedure if exists complete_appointment;
delimiter /​/
create procedure complete_appointment (
	in ip_patientId char(11),
    in ip_apptDate DATE, 
    in ip_apptTime TIME
)
sp_main: begin
	if ip_patientId is not null and ip_apptDate is not null and ip_apptTime is not null and
    exists (select * from appointment where ip_patientId = patientId and ip_apptDate = apptDate and
    ip_apptTime = apptTime) then
    update patient set funds = funds - (select cost from appointment where ip_patientId = patientId and
    ip_apptDate = apptDate and ip_apptTime = apptTime) where ip_patientId = ssn;
    delete from appointment where ip_patientId = patientId and ip_apptDate = apptDate and
    ip_apptTime = apptTime;
    end if;
end /​/
delimiter ;

-- [20] complete_orders()
-- -----------------------------------------------------------------------------
/* This stored procedure attempts to complete a certain number of orders based on the 
passed in value. Orders should be completed in order of their priority, from highest to
lowest. If multiple orders have the same priority, the older dated one should be 
completed first. Any completed orders should be removed from the system, and patients 
should be charged accordingly. Ensure that there is a non-null number of orders
passed in, and complete as many as possible up to that limit. */
-- -----------------------------------------------------------------------------
-- helper view
create or replace view current_order as 
SELECT * from med_order order by priority desc, orderDate asc LIMIT 1;


drop procedure if exists complete_orders;
delimiter /​/
create procedure complete_orders (
	in ip_num_orders integer
)
sp_main: begin
	declare counter integer DEFAULT 0;
    declare ssn char(11);
    declare orderNum integer;
    declare price integer;
	if ip_num_orders is null or ip_num_orders < 1 then 
		leave sp_main;
	end if;
	repeat 
		select patientId into ssn from current_order;
        select orderNumber into orderNum from current_order;
        select cost into price from current_order;
        if ssn is null then 
			leave sp_main;
		end if;
        delete from med_order where orderNumber = orderNum;
        delete from lab_work where orderNumber = orderNum;
        update patient set funds = funds - price where patient.ssn = ssn;
		set counter = counter + 1;
    until counter >= ip_num_orders end repeat;
end /​/
delimiter ;
