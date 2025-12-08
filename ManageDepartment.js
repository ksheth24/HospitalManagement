import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function ManageDepartment() {
    const [ssn, setSsn] = React.useState('');
    const [deptId, setDeptId] = React.useState('');

    const submit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/sp/record_symptom", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ip_ssn: ssn,
                    ip_deptId: deptId
                })
            });
            if (response.ok) {
                alert("Manager has been assigned successfully!");
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
                label = "Department ID"
                value = {deptId}
                onChange = {(e) => setDeptId(e.target.value)}
            />

            <Button 
                variant="outlined"
                onClick = {submit}>
                Send
            </Button>


        </div>

        
    )
}