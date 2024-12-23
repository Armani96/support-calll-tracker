// src/components/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Paper, Card, CardContent, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmailIcon from '@mui/icons-material/Email';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import Notifications from './Notifications';
import Reminders from './Reminders';
import Chart from 'react-apexcharts';

const Dashboard = () => {
    const [records, setRecords] = useState([]);
    const [callBacksRequired, setCallBacksRequired] = useState(0);
    const [waitingForEmail, setWaitingForEmail] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [notCompleted, setNotCompleted] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState({});

    const fetchRecords = useCallback(async () => {
        try {
            const response = await axios.get('http://192.168.178.227:5001/records');
            const fetchedRecords = response.data.records;
            setRecords(fetchedRecords);
            calculateCounts(fetchedRecords);
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    }, []);

    useEffect(() => {
        fetchRecords();
        const intervalId = setInterval(fetchRecords, 3000); // Fetch records every 3 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [fetchRecords]);

    const calculateCounts = (fetchedRecords) => {
        let callBacks = 0;
        let waitingEmail = 0;
        let completedCount = 0;
        let notCompletedCount = 0;

        fetchedRecords.forEach(record => {
            if (record.callBackRequired) callBacks++;
            if (record.waitingForEmail) waitingEmail++;
            if (record.completed) completedCount++;
            else notCompletedCount++;
        });

        setCallBacksRequired(callBacks);
        setWaitingForEmail(waitingEmail);
        setCompleted(completedCount);
        setNotCompleted(notCompletedCount);
    };

    const handleOpenDialog = (id) => {
        const record = records.find(r => r.id === id);
        setDialogContent(record);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const chartData = {
        series: [completed, notCompleted],
        options: {
            chart: {
                type: 'donut',
            },
            labels: ['Completed', 'Open Issues'],
            theme: {
                mode: 'dark',
            },
        },
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ padding: 2 }}>
                        <Box display="flex" alignItems="center">
                            <NotificationsActiveIcon color="primary" sx={{ marginRight: 2 }} />
                            <Typography variant="h6">Callbacks Required</Typography>
                        </Box>
                        <Typography variant="h4">{callBacksRequired}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ padding: 2 }}>
                        <Box display="flex" alignItems="center">
                            <EmailIcon color="secondary" sx={{ marginRight: 2 }} />
                            <Typography variant="h6">Waiting for Email</Typography>
                        </Box>
                        <Typography variant="h4">{waitingForEmail}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ padding: 2 }}>
                        <Box display="flex" alignItems="center">
                            <CheckCircleIcon color="success" sx={{ marginRight: 2 }} />
                            <Typography variant="h6">Completed</Typography>
                        </Box>
                        <Typography variant="h4">{completed}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ padding: 2 }}>
                        <Box display="flex" alignItems="center">
                            <AssignmentLateIcon color="error" sx={{ marginRight: 2 }} />
                            <Typography variant="h6">Not Completed</Typography>
                        </Box>
                        <Typography variant="h4">{notCompleted}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Issue Distribution
                            </Typography>
                            <Chart options={chartData.options} series={chartData.series} type="donut" height={300} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Notifications records={records} onClickRecord={handleOpenDialog} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Reminders records={records} onClickRecord={handleOpenDialog} />
                </Grid>
            </Grid>

            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    style: {
                        backgroundColor: '#1c1c1c',
                        color: '#fff',
                        borderRadius: '8px',
                    },
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Record Details</span>
                    <IconButton edge="end" color="inherit" onClick={handleCloseDialog} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1"><strong>ID:</strong> {dialogContent.id}</Typography>
                    <Typography variant="body1"><strong>Customer Name:</strong> {dialogContent.customerName}</Typography>
                    <Typography variant="body1"><strong>Status:</strong> {dialogContent.opgelostDoorgezet ? 'Opgelost' : 'Doorgezet'}</Typography>
                    <Typography variant="body1"><strong>Probleem:</strong> {dialogContent.probleem}</Typography>
                    <Typography variant="body1"><strong>Oplossing:</strong> {dialogContent.oplossing}</Typography>
                    <Typography variant="body1"><strong>Note:</strong> {dialogContent.note}</Typography>
                    <Typography variant="body1"><strong>Verbeter punten:</strong> {dialogContent.verbeterPunten}</Typography>
                    <Typography variant="body1"><strong>Callback Required:</strong> {dialogContent.callBackRequired ? 'Yes' : 'No'}</Typography>
                    <Typography variant="body1"><strong>Waiting for Email:</strong> {dialogContent.waitingForEmail ? 'Yes' : 'No'}</Typography>
                    <Typography variant="body1"><strong>Timestamp:</strong> {dialogContent.timestamp}</Typography>
                    <Typography variant="body1"><strong>Completed:</strong> {dialogContent.completed ? 'Yes' : 'No'}</Typography>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Dashboard;
