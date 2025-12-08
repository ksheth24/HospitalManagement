import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function AssignRoomToPatient() {
    const [ssn, setSsn] = React.useState('');
    const [RoomNumber, setRoomNumber] = React.useState('');
    const [roomType, setRoomType] = React.useState('');

    const submit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/sp/add_patient", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ip_ssn: ssn,
                    ip_roomNumber: RoomNumber,
                    ip_roomType: roomType
                })
            });
            if (response.ok) {
                alert("Room assigned successfully!");
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
                label = "Room Number"
                value = {RoomNumber}
                onChange = {(e) => setRoomNumber(e.target.value)}
            />

            <TextField
                label = "Room Type"
                value = {roomType}
                onChange = {(e) => setRoomType(e.target.value)}
            />

            <Button 
                variant="outlined"
                onClick = {submit}>
                Send
            </Button>


        </div>

        
    )
}