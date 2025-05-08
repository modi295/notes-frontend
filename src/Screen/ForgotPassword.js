import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import api from '../Services/api';
import { showAlert } from '../Utility/ConfirmBox';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/forgotPassword', { email });
            setPasswordUpdateSuccess(true);
            console.log("mail sent");
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
            showAlert('Error: ' + errorMsg, "error");
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url('/loginbg.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
            }}
        >
            <Box sx={{ mb: 3 }}>
                <img src="top-logo.png" alt="Logo" style={{ maxWidth: '200px' }} />
            </Box>

            <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%', textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom sx={{ color: '#734dc4' }}>
                    Forgot Password?
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Enter your Email Address to reset password
                </Typography>

                {passwordUpdateSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        <strong>&#10004;</strong> Your new password has been sent to your email address!
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        FF
                        sx={{
                            mt: 2,
                            backgroundColor: '#734dc4',
                            '&:hover': {
                                backgroundColor: '#5e3ca8',
                            },
                        }}
                    >
                        SUBMIT
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default ForgotPassword;
