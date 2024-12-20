// src/components/EditPopup.js
import React, { useState, useEffect, useContext } from 'react';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControlLabel, Checkbox, Switch, Grid, Box } from '@mui/material';
import { DataContext } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const EditPopup = ({ open, handleClose, record }) => {
    const { updateRecord } = useContext(DataContext);
    const { user } = useAuth();
    const [form, setForm] = useState({ ...record });

    useEffect(() => {
        setForm({ ...record });
    }, [record]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
            lastEditedBy: user?.username || 'Unknown'
        });
    };

    const handleSwitchChange = (e) => {
        const { name, checked } = e.target;
        setForm({
            ...form,
            [name]: checked,
            lastEditedBy: user?.username || 'Unknown'
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateRecord(form);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Edit Record</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="customerName"
                                label="Customer Name"
                                value={form.customerName}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={form.opgelostDoorgezet}
                                        onChange={handleSwitchChange}
                                        name="opgelostDoorgezet"
                                        color="primary"
                                    />
                                }
                                label="Zelf opgelost"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="probleem"
                                label="Probleem"
                                value={form.probleem}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="oplossing"
                                label="Oplossing"
                                value={form.oplossing}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="note"
                                label="Note"
                                value={form.note}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="verbeterPunten"
                                label="Verbeter punten"
                                value={form.verbeterPunten}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.callBackRequired}
                                        onChange={handleSwitchChange}
                                        name="callBackRequired"
                                        color="primary"
                                    />
                                }
                                label="Callback Required"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.waitingForEmail}
                                        onChange={handleSwitchChange}
                                        name="waitingForEmail"
                                        color="primary"
                                    />
                                }
                                label="Waiting for Email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.completed}
                                        onChange={handleSwitchChange}
                                        name="completed"
                                        color="primary"
                                    />
                                }
                                label="Completed"
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Save
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditPopup;
