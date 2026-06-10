import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ThankYou = () => {
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <CheckCircleIcon sx={{ fontSize: 150, color: 'green' }} />
            <Typography variant="h4" align="center" sx={{ marginTop: '50px' }}>
                Your order has been placed!!
            </Typography>
            <Typography variant="h4" align="center" sx={{ marginTop: '30px' }}>
                Thank You!!
            </Typography>
        </Container>
    );
};

export default ThankYou;