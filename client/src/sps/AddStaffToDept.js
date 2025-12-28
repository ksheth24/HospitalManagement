import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function AddStaffToDept() {
    const [ssn, setSsn] = React.useState('');
    const [deptId, setDeptId] = React.useState('');
    const [fname, setFname] = React.useState('');
    const [lname, setLname] = React.useState('');
    const [bdate, setBdate] = React.useState('');
    const [sdate, setSdate] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [staffId, setStaffId] = React.useState('');
    const [salary, setSalary] = React.useState('');

    const submit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/sp/add_staff_to_dept", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ip_deptId: deptId,
                    ip_ssn: ssn,
                    ip_firstName: fname,
                    ip_lastName: lname,
                    ip_birthdate: bdate,
                    ip_startdate: sdate,
                    ip_address: address,
                    ip_staffId: staffId,
                    ip_salary: salary
                })
            });
            if (response.ok) {
                alert("Staff has been added to department successfully!");
            }
        }
        catch (error) {
            alert("")
        }
    };

    return (
        <div style = {{display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px'}}>
            <TextField
                label = "Department ID"
                value = {deptId}
                onChange = {(e) => setDeptId(e.target.value)}
            />

            <TextField
                label = "Staff SSN"
                value = {ssn}
                onChange = {(e) => setSsn(e.target.value)}
            />

            <TextField
                label = "First Name"
                value = {fname}
                onChange = {(e) => setFname(e.target.value)}
            />

            <TextField
                label = "Last Name"
                value = {lname}
                onChange = {(e) => setLname(e.target.value)}
            />

            <TextField
                label = "Birthdate"
                value = {bdate}
                onChange = {(e) => setBdate(e.target.value)}
            />

            <TextField
                label = "Start Date"
                value = {sdate}
                onChange = {(e) => setSdate(e.target.value)}
            />

            <TextField
                label = "Address"
                value = {address}
                onChange = {(e) => setAddress(e.target.value)}
            />

            <TextField
                label = "Staff ID"
                value = {staffId}
                onChange = {(e) => setStaffId(e.target.value)}
            />

            <TextField
                label = "Salary"
                value = {salary}
                onChange = {(e) => setSalary(e.target.value)}
            />

            <Button 
                variant="outlined"
                onClick = {submit}>
                Send
            </Button>


        </div>

        
    )
}