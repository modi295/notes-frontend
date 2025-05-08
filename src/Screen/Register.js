import React, { useState } from 'react';
import {
  Box, Button, Container, Grid, Paper, TextField, Typography,
  IconButton, InputAdornment, Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import api from '../Services/api';
import { showSuccessToast } from '../Utility/ToastUtility';
import { showAlert } from '../Utility/ConfirmBox';
import { ToastContainer } from 'react-toastify';

function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[^\s]{6,24}$/;

  const checkEmailExists = async (email) => {
    try {
      const response = await api.get(`/users/${email}`);
      return response.data;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessages([]);

    const existingUser = await checkEmailExists(email);
    if (existingUser) {
      setErrorMessages(prev => [...prev, 'Email already exists. Please use a different email.']);
      return;
    }

    if (!strongPasswordRegex.test(password)) {
      setErrorMessages(prev => [
        ...prev,
        'Password must be 6-24 characters with uppercase, lowercase, number, and special character.',
      ]);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessages(prev => [...prev, 'Passwords do not match!']);
      return;
    }

    try {
      await api.post('/register', { firstName, lastName, email, password });
      setRegistrationSuccess(true);
      showSuccessToast('Registered successfully');
      setTimeout(() => navigate('/login'), 4000);
    } catch (error) {
      showAlert('Error creating account: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url("/loginbg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={5} sx={{ p: 4, borderRadius: 3, mt: '30px', maxWidth: '90%' }}>
          <Box textAlign="center" mb={2}>
            <Box sx={{ display: 'inline-block', mb: 2 }}>
              <img
                src="top-logo.png"
                alt="Logo"
                width="100"
                style={{
                  filter:
                    'brightness(0) saturate(100%) invert(23%) sepia(50%) saturate(800%) hue-rotate(240deg) brightness(90%) contrast(90%)',
                }}
              />
            </Box>
            <Typography variant="h5" sx={{ color: '#734dc4' }}>
              Create an Account
            </Typography>
            <Typography variant="body2">Enter your details to SignUp</Typography>
          </Box>

          {errorMessages.length > 0 &&
            errorMessages.map((message, index) => (
              <Alert
                key={index}
                severity="error"
                sx={{ mb: 2 }}
                action={
                  <IconButton
                    size="small"
                    onClick={() =>
                      setErrorMessages(prev => prev.filter((_, i) => i !== index))
                    }
                  >
                    &times;
                  </IconButton>
                }
              >
                {message}
              </Alert>
            ))}

          {registrationSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              &#10004; Your account has been successfully created!<br />
              &#10004; Email Sent. Please verify it!
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  inputProps={{ maxLength: 24 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                mt: 3,
                backgroundColor: '#734dc4',
                '&:hover': {
                  backgroundColor: '#5e3ca8',
                },
              }}
            >
              SIGN UP
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#734dc4', textDecoration: 'none' }}>
                Login
              </Link>
            </Typography>
          </form>
        </Paper>
        <ToastContainer />
      </Container>
    </Box>
  );
}

export default Register;
