import React, { useState } from 'react';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import DOMPurify from 'dompurify'; 

export default function SignUp() {
    const [error, setError] = useState(null);
    const [successAlert, setSuccessAlert] = useState(false);
    const navigate = useNavigate();

    const hasSQLInjection = (input) => {
        const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'UNION', 'FROM', 'WHERE'];
        const sanitizedInput = input.toUpperCase();

        return sqlKeywords.some(keyword => sanitizedInput.includes(keyword));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const originalEmail = formData.get("email");
        const originalUsername = formData.get("username");
        const originalPassword = formData.get("password");
        const originalPassword2 = formData.get("password2");

        const sanitizedEmail = DOMPurify.sanitize(originalEmail);
        const sanitizedUsername = DOMPurify.sanitize(originalUsername);
        const sanitizedPassword = DOMPurify.sanitize(originalPassword);
        const sanitizedPassword2 = DOMPurify.sanitize(originalPassword2);

        if (
            originalEmail !== sanitizedEmail ||
            originalUsername !== sanitizedUsername ||
            originalPassword !== sanitizedPassword ||
            originalPassword2 !== sanitizedPassword2
        ) {
            console.warn('Potential XSS detected');
            setError('Potential XSS detected');
            return;
        }

        if (hasSQLInjection(originalEmail) || hasSQLInjection(originalUsername) || hasSQLInjection(originalPassword)
            || hasSQLInjection(originalPassword2)) {
            console.warn('Potential SQL injection detected');
            setError('Potential SQL injection detected');
            return;
        }

        if (sanitizedPassword !== sanitizedPassword2) {
            setError('Passwords do not match');
            return;
        }

        if (!validatePassword(sanitizedPassword)) {
            setError('Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: sanitizedEmail,
                    username: sanitizedUsername,
                    password: sanitizedPassword,
                    password2: sanitizedPassword2,
                }),
            });

            if (!response.ok) {
                const data = await response.json();

                if (data && data.error) {
                    setError(data.error);
                } else {
                    setError('Unknown error');
                }
            } else {
                setError(null);
                setSuccessAlert(true);

                setTimeout(() => {
                    setSuccessAlert(false);
                    navigate('/login');
                }, 3000); 
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Network error or server unreachable');
        }
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
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
                    Sign Up
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
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password2"
                        label="Confirm Password"
                        type="password"
                        id="password2"
                        autoComplete="current-password"
                    />

                    {error && (
                        <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>
                    )}

                    {successAlert && (
                        <Alert severity="success" sx={{ mt: 1 }}>
                            Registration successful! Redirecting to Login...
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        SIGN UP
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/login" variant="body2">
                                Have an account? Log In
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}