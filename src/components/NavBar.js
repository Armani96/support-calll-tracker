import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    return (
        <AppBar position="static" className="navbar">
            <Toolbar>
                <Typography 
                    variant="h6" 
                    className="navbar-title" 
                    component={Link} 
                    to="/"
                ><div className='logo'>
                    Support Call Tracking
                    </div>
                </Typography>
                <Box className="navbar-links">
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/"
                        className="navbar-button"
                    >
                        Dashboard
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/form"
                        className="navbar-button"
                    >
                        ADD New Call
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/table"
                        className="navbar-button"
                    >
                        Call Table
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
