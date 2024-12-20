import React from 'react';
import { Container, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Form from './components/Form';
import Table from './components/Table';
import Dashboard from './components/Dashboard';
import NavBar from './components/NavBar';
import Login from './components/Login';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ffbe0b',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212',
            paper: '#1c1c1c',
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

const PrivateRoute = ({ element: Element, ...rest }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
};

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <DataProvider>
                    <Router>
                        <NavBar />
                        <Container maxWidth="xl">
                            <Box sx={{ my: 4 }}>
                                <Routes>
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/" element={<PrivateRoute element={Dashboard} />} />
                                    <Route path="/form" element={<PrivateRoute element={Form} />} />
                                    <Route path="/table" element={<PrivateRoute element={Table} />} />
                                    <Route path="/table/:id" element={<PrivateRoute element={Table} />} />
                                    <Route path="*" element={<Navigate to="/" />} />
                                </Routes>
                            </Box>
                        </Container>
                    </Router>
                </DataProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
