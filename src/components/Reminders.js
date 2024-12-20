import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const Reminders = ({ records, onClickRecord }) => {
    const reminders = records.filter(record => record.callBackRequired || record.waitingForEmail).map(record => ({
        id: record.id,
        message: `Action required for: ${record.customerName}`,
        callBackRequired: record.callBackRequired,
        waitingForEmail: record.waitingForEmail,
    }));

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    Reminders
                </Typography>
                <List>
                    {reminders.map(reminder => (
                        <ListItem
                            key={reminder.id}
                            button
                            onClick={() => onClickRecord(reminder.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <ListItemIcon>
                                <Box display="flex" alignItems="center">
                                    {reminder.waitingForEmail && <EmailIcon color="primary" />}
                                    {reminder.callBackRequired && <NotificationsActiveIcon color="secondary" />}
                                </Box>
                            </ListItemIcon>
                            <ListItemText primary={reminder.message} />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default Reminders;
