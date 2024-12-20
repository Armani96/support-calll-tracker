import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Notifications = ({ records, onClickRecord }) => {
    const notifications = records.filter(record => !record.completed).map(record => ({
        id: record.id,
        message: `Action pending: ${record.customerName}`,
    }));

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    Notifications
                </Typography>
                <List>
                    {notifications.map(notification => (
                        <ListItem 
                            key={notification.id} 
                            button 
                            onClick={() => onClickRecord(notification.id)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <ListItemIcon>
                                <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary={notification.message} />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default Notifications;
