import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function RemoveStaffFromDept() {
    const [ssn, setSsn] = React.useState('');
    const [deptId, setDeptId] = React.useState('');

    const submit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/sp/remove_staff_from_dept", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ip_ssn: ssn,
                    ip_DeptId: deptId
                })
            });
            if (response.ok) {
                alert("Staff has been removed Successfully!");
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
                label = "DeptId"
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