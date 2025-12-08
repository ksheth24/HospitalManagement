import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function AssignNurseToRoom() {
    const [nurseId, setNurseId] = React.useState('');
    const [RoomNumber, setRoomNumber] = React.useState('');

    const submit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/sp/assign_nurse_to_room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ip_nurseId: nurseId,
                    ip_roomNumber: RoomNumber
                })
            });
            if (response.ok) {
                alert("Nurse assigned successfully!");
            }
        }
        catch (error) {
            alert("")
        }
    };

    return (
        <div style = {{display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px'}}>
            <TextField
                label = "Nurse ID"
                value = {nurseId}
                onChange = {(e) => setNurseId(e.target.value)}
            />

            <TextField
                label = "Room Number"
                value = {RoomNumber}
                onChange = {(e) => setRoomNumber(e.target.value)}
            />

            <Button 
                variant="outlined"
                onClick = {submit}>
                Send
            </Button>


        </div>

        
    )
}