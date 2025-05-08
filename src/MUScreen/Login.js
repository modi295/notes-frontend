import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../Services/api';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import {Box, Button, TextField, Typography,FormControlLabel,Paper, IconButton, InputAdornment,Switch,ToggleButtonGroup, ToggleButton} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function LoginMU() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const secretKey = 'YourSecretEncryptionKey';

  const encrypt = (data) => CryptoJS.AES.encrypt(data, secretKey).toString();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLoginMethodChange = (event, newMethod) => {
    if (newMethod !== null) {
      setLoginMethod(newMethod);
      setErrorMessage('');
      setOtpSent(false);
      setOtp('');
      setPassword('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (loginMethod === 'password') {
        const response = await api.post('/login', { email, password });
        const { token, role } = response.data;
        handleLoginSuccess(token, email, role);
      } else {
        const response = await api.post('/verifyOtp', { email, otp });
        const { token, role } = response.data;
        handleLoginSuccess(token, email, role);
      }
    } catch (error) {
      const message = error?.response?.data?.error || 'An error occurred';
      setErrorMessage(message);
    }
  };

  const handleLoginSuccess = (token, email, role) => {
    if (rememberMe) {
      Cookies.set('token', token, { expires: 2 });
      Cookies.set('email', encrypt(email), { expires: 2 });
      Cookies.set('role', encrypt(role), { expires: 2 });
    } else {
      Cookies.set('token', token, { expires: 1 / 48 });
      Cookies.set('email', encrypt(email), { expires: 1 / 48 });
      Cookies.set('role', encrypt(role), { expires: 1 / 48 });
    }

    setLoginSuccess(true);
    navigate('/userprofile');
    window.location.reload();
  };

  const handleSendOtp = async () => {
    try {
      await api.post('/sendOtp', { email });
      setOtpSent(true);
      setResendTimer(60);
      setCanResend(false);
    } catch (error) {
      setErrorMessage('Failed to send OTP');
    }
  };

  useEffect(() => {
    let timer;
    if (otpSent && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [otpSent, resendTimer]);

  return (
    <Box
      sx={{
        backgroundImage: 'url(/loginbg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box textAlign="center">
          <img src="top-logo.png" alt="Logo" style={{ maxWidth: '150px' }} />
        </Box>

        <Paper elevation={6} sx={{ padding: 4, width: { xs: '90%', sm: '400px' }, borderRadius: 3 }}>
          <Typography variant="h4" color="#734dc4" textAlign="center" mb={1}>
            Login
          </Typography>
          <Typography variant="body2" color="textSecondary" textAlign="center" mb={2}>
            Login using your Password or OTP
          </Typography>

          {loginSuccess ? (
            <Typography color="success.main" textAlign="center" variant="subtitle2">
              Login successful!
            </Typography>
          ) : errorMessage && (
            <Typography color="error" textAlign="center" variant="subtitle2">
              {errorMessage}
            </Typography>
          )}

          <ToggleButtonGroup
            value={loginMethod}
            exclusive
            onChange={handleLoginMethodChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            <ToggleButton value="password">Password</ToggleButton>
            <ToggleButton value="otp">OTP</ToggleButton>
          </ToggleButtonGroup>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {loginMethod === 'password' ? (
              <>
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Box textAlign="right" mt={1} mb={2}>
                  <Link to="/forgotPassword" style={{ color: '#734dc4', fontSize: 'small', textDecoration: 'none' }}>
                    Forgot Password?
                  </Link>
                </Box>
              </>
            ) : (
              <>
                {otpSent && (
                  <TextField
                    label="Enter OTP"
                    fullWidth
                    margin="normal"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                )}
                {!otpSent ? (
                  <Button
                    onClick={handleSendOtp}
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2, mb: 1 }}
                    disabled={!email}
                  >
                    Send OTP
                  </Button>
                ) : (
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Typography variant="body2" color="textSecondary">
                      {canResend ? 'Didn’t receive OTP?' : `Resend OTP in ${resendTimer}s`}
                    </Typography>
                    <Button
                      variant="text"
                      disabled={!canResend}
                      onClick={handleSendOtp}
                      sx={{ textTransform: 'none', color: '#734dc4' }}
                    >
                      Resend OTP
                    </Button>
                  </Box>
                )}
              </>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember Me"
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ mt: 2, backgroundColor: '#734dc4', '&:hover': { backgroundColor: '#5a3ca8' } }}
            >
              LOGIN
            </Button>

            <Box textAlign="center" mt={2}>
              <Typography variant="body2" color="textSecondary">
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#734dc4', textDecoration: 'none' }}>
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}

export default LoginMU;
