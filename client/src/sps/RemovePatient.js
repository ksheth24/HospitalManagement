import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function RemovePatient() {
    const [ssn, setSsn] = React.useState('');

    const submit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/sp/remove_patient", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ip_ssn: ssn,
                })
            });
            if (response.ok) {
                alert("Patient removed successfully!");
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

            <Button 
                variant="outlined"
                onClick = {submit}>
                Send
            </Button>


        </div>

        
    )
}