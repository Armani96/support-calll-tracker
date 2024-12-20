// src/components/Form.js
import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { TextField, Button, Switch, FormControlLabel, Grid, Box, Autocomplete } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Form = () => {
    const { addRecord, records } = useContext(DataContext);
    const { user } = useAuth();
    const [newRecord, setNewRecord] = useState({
        customerName: '',
        opgelostDoorgezet: false,
        probleem: '',
        oplossing: '',
        note: '',
        verbeterPunten: '',
        callBackRequired: false,
        waitingForEmail: false,

        completed: false,
        timestamp: new Date().toISOString(),
        createdBy: user.username,
        lastEditedBy: user.username,
    });

// Gekke easteregg Ouleh...

    const [customerNameSuggestions, setCustomerNameSuggestions] = useState([]);

    useEffect(() => {
        const uniqueCustomerNames = [...new Set(records.map(record => record.customerName))];
        setCustomerNameSuggestions(uniqueCustomerNames);
    }, [records]);

    const getNextId = () => {
        if (!records || records.length === 0) {
            return 1;
        }
        const maxId = Math.max(...records.map(record => parseInt(record.id, 10)));
        return maxId + 1;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewRecord(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newId = getNextId();
        const timestamp = new Date().toISOString();
        const recordToAdd = { ...newRecord, id: newId.toString(), timestamp };
        addRecord(recordToAdd);
        setNewRecord({
            customerName: '',
            opgelostDoorgezet: false,
            probleem: '',
            oplossing: '',
            note: '',
            verbeterPunten: '',
            callBackRequired: false,
            waitingForEmail: false,
            completed: false,
            timestamp: new Date().toISOString(),
            createdBy: user.username,
            lastEditedBy: user.username,
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Autocomplete
                        freeSolo
                        options={customerNameSuggestions}
                        inputValue={newRecord.customerName}
                        onInputChange={(event, newInputValue) => {
                            setNewRecord(prevState => ({
                                ...prevState,
                                customerName: newInputValue,
                            }));
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Customer Name"
                                fullWidth
                                autoFocus
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="probleem"
                        label="Probleem"
                        fullWidth
                        value={newRecord.probleem}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="oplossing"
                        label="Oplossing"
                        fullWidth
                        value={newRecord.oplossing}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="note"
                        label="Note"
                        fullWidth
                        value={newRecord.note}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="verbeterPunten"
                        label="Verbeter punten"
                        fullWidth
                        value={newRecord.verbeterPunten}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={newRecord.opgelostDoorgezet}
                                onChange={handleChange}
                                name="opgelostDoorgezet"
                                color="primary"
                            />
                        }
                        label="Zelf opgelost"
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={newRecord.callBackRequired}
                                onChange={handleChange}
                                name="callBackRequired"
                                color="primary"
                            />
                        }
                        label="Callback Required"
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={newRecord.waitingForEmail}
                                onChange={handleChange}
                                name="waitingForEmail"
                                color="primary"
                            />
                        }
                        label="Waiting for Email"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={newRecord.completed}
                                onChange={handleChange}
                                name="completed"
                                color="primary"
                            />
                        }
                        label="Completed"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" fullWidth variant="contained" color="primary">
                        Add Record
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Form;
