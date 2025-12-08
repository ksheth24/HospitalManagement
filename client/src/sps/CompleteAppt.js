import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function CompleteAppt() {
    const [ssn, setSsn] = React.useState('');
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');
  

    const submit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/sp/complete_appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ip_patientId: ssn,
                    ip_apptDate: date,
                    ip_apptTime: time
                })
            });
            if (response.ok) {
                alert("Appointment completed successfully!");
            }
        }
        catch (error) {
            alert("")
        }
    };

    return (
        <div style = {{display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px'}}>
            <TextField
                label = "PatientId"
                value = {ssn}
                onChange = {(e) => setSsn(e.target.value)}
            />

            <TextField
                label = "Appointment Date"
                value = {date}
                onChange = {(e) => setDate(e.target.value)}
            />

            <TextField
                label = "Appointment Time"
                value = {time}
                onChange = {(e) => setTime(e.target.value)}
            />

            <Button 
                variant="outlined"
                onClick = {submit}>
                Send
            </Button>


        </div>

        
    )
}