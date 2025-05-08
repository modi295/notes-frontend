import React, { useState } from 'react';
import { Box,Button,TextField,Typography,IconButton, InputAdornment,Paper,Container,Alert} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../Services/api';
import { getUserEmail } from '../Services/auth';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatchError, setPasswordsMatchError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[^\s]{6,24}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordLengthError(false);
    setPasswordsMatchError(false);

    if (!strongPasswordRegex.test(newPassword)) {
      setPasswordLengthError(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordsMatchError(true);
      return;
    }

    try {
      const email = getUserEmail();
      await api.put('/changePassword', { email, oldPassword, newPassword });
      setSuccessMessage('Password updated successfully');
      setErrorMessage('');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setErrorMessage('Error updating password: ' + (error.response?.data?.error || error.message));
      setSuccessMessage('');
    }
  };

  const passwordField = (label, value, setValue, show, toggleShow) => (
    <TextField
      fullWidth
      required
      type={show ? 'text' : 'password'}
      label={label}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      variant="outlined"
      margin="normal"
      inputProps={{ maxLength: 24 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={toggleShow} edge="end">
              {show ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <Box
      sx={{
        backgroundImage: 'url("/loginbg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Paper elevation={4}sx={{p: 4, width: '80%' }}>
            <Box display="flex" justifyContent="center" mb={2}>
              <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 1, borderRadius: 1,display: 'inline-block',}} >
                <img src="top-logo.png" alt="Logo"width="120" style={{ filter: 'brightness(0) saturate(100%) invert(23%) sepia(50%) saturate(800%) hue-rotate(240deg) brightness(90%) contrast(90%)'}}/>
              </Box>
            </Box>
            <Typography variant="h5" align="center"gutterBottom  sx={{ color: '#734dc4' }} > Change Password </Typography>
            <Typography variant="body2" align="center" mb={2}>Enter Old Password to change your password </Typography>

            <Box mb={2}>
              {successMessage && (
                <Alert severity="success" onClose={() => setSuccessMessage('')}>
                  {successMessage}
                </Alert>
              )}
              {errorMessage && (
                <Alert severity="error" onClose={() => setErrorMessage('')}>
                  {errorMessage}
                </Alert>
              )}
              {passwordLengthError && (
                <Alert severity="warning" onClose={() => setPasswordLengthError(false)}>
                  Password must be 6–24 characters with uppercase, lowercase, number, and special character.
                </Alert>
              )}
              {passwordsMatchError && (
                <Alert severity="error" onClose={() => setPasswordsMatchError(false)}>
                  Passwords do not match!
                </Alert>
              )}
            </Box>

            <form onSubmit={handleSubmit}>
              {passwordField('Old Password', oldPassword, setOldPassword,showOldPassword,() => setShowOldPassword(!showOldPassword))}
              {passwordField( 'New Password', newPassword,  setNewPassword, showNewPassword, () => setShowNewPassword(!showNewPassword))}
              {passwordField('Confirm New Password',confirmPassword,setConfirmPassword, showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword) )}

              <Button fullWidth variant="contained" type="submit"
                sx={{
                  mt: 3,
                  backgroundColor: '#734dc4',
                  '&:hover': {
                    backgroundColor: '#5e3ca8',
                  },
                }}
              > Submit</Button>
            </form>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default ChangePassword;
