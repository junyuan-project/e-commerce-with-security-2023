import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = ({ isLoggedIn, onLoginChange }) => {
    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        onLoginChange(false);
        window.location.href = '/'; 
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    E-Commerce
                </Typography>
                <Button href="/" color="inherit">Home</Button>
                <Button href="/products" color="inherit">Products</Button>
                {isLoggedIn ? (
                    <Button onClick={handleLogout} color="inherit">Logout</Button>
                ) : (
                    <>
                        <Button href="/login" color="inherit">Login</Button>
                        <Button href="/signup" color="inherit">Sign Up</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;