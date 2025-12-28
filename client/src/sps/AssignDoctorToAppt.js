import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function AssignDoctorToAppt() {
    const [ssn, setSsn] = React.useState('');
    const [ApptDate, setApptDate] = React.useState('');
    const [Time, setTime] = React.useState('');
    const [DoctorId, setDoctorId] = React.useState('');

    const submit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/sp/assign_doctor_to_appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ip_patientId: ssn,
                    ip_apptDate: ApptDate,
                    ip_apptTime: Time,
                    ip_doctorId: DoctorId
                })
            });
            if (response.ok) {
                alert("Doctor has been assigned successfully!");
            }
        }
        catch (error) {
            alert("")
        }
    };

    return (
        <div style = {{display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px'}}>

            <TextField
                label = "SSN"
                value = {ssn}
                onChange = {(e) => setSsn(e.target.value)}
            />

            <TextField
                label = "Appointment Date"
                value = {ApptDate}
                onChange = {(e) => setApptDate(e.target.value)}
            />

            <TextField
                label = "Appointment Time"
                value = {Time}
                onChange = {(e) => setTime(e.target.value)}
            />

            <TextField
                label = "Doctor ID"
                value = {DoctorId}
                onChange = {(e) => setDoctorId(e.target.value)}
            />

            <Button 
                variant="outlined"
                onClick = {submit}>
                Send
            </Button>


        </div>

        
    )
}