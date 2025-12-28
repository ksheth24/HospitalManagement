import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export function CompleteOrder() {
    const [numOrders, setNumOrders] = React.useState('');
    const submit = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/sp/complete_orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ip_num_orders: numOrders
                })
            });
            if (response.ok) {
                alert("Orders completed!");
            }
        }
        catch (error) {
            alert("")
        }
    };

    return (
        <div style = {{display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px'}}>
            <TextField
                label = "Number of Orders"
                value = {numOrders}
                onChange = {(e) => setNumOrders(e.target.value)}
            />

            <Button 
                variant="outlined"
                onClick = {submit}>
                Send
            </Button>


        </div>

        
    )
}