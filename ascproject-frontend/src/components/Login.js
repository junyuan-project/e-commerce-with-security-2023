import React, { useState, useEffect } from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import DOMPurify from 'dompurify'; 

export default function SignIn({ onLoginChange }) {
    const [error, setError] = useState(null);
    const [successAlert, setSuccessAlert] = useState(false);
    const navigate = useNavigate();

    const hasSQLInjection = (input) => {
        const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'UNION', 'FROM', 'WHERE'];
        const sanitizedInput = input.toUpperCase();

        return sqlKeywords.some(keyword => sanitizedInput.includes(keyword));
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const originalEmail = formData.get("email");
        const originalPassword = formData.get("password");

        const sanitizedEmail = DOMPurify.sanitize(originalEmail);
        const sanitizedPassword = DOMPurify.sanitize(originalPassword);

        if (originalEmail !== sanitizedEmail || originalPassword !== sanitizedPassword) {
            console.warn('Potential XSS detected');
            setError('Potential XSS detected'); 
            return;
        }

        if (hasSQLInjection(originalEmail) || hasSQLInjection(originalPassword)) {
            console.warn('Potential SQL injection detected');
            setError('Potential SQL injection detected');
            return;
        }

        const requestData = {
            email: sanitizedEmail,
            password: sanitizedPassword,
        };

        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const data = await response.json();
                const accessToken = data.token;

                localStorage.setItem('accessToken', accessToken);

                setError(null);

                setSuccessAlert(true);

                setTimeout(() => {
                    setSuccessAlert(false);
                    console.log('Login successful');

                    navigate('/');
                    onLoginChange(true);
                }, 3000); 

            } else {
                const errorData = await response.json();
                console.error('Login failed', errorData.error);
                setError('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('Network error or server unreachable');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    Log In
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />

                    {error && (
                        <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>
                    )}

                    {successAlert && (
                        <Alert severity="success" sx={{ mt: 1 }}>
                            Login successful! Redirecting...
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        LOG IN
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}