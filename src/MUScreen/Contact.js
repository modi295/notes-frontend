import React, { useState } from 'react';
import Banner from '../Component/banner';
import api from '../Services/api';
import { getUserEmail } from '../Services/auth';
import { ToastContainer } from 'react-toastify';
import { showErrorToast } from '../Utility/ToastUtility';
import { Box, TextField, Typography, Button, Paper } from '@mui/material';

function ContactUsMU() {
  const [fullName, setFullName] = useState('');
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState(getUserEmail());
  const [comment, setComment] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contact', { fullName, subject, email, comment });
      setFullName('');
      setSubject('');
      setEmail('');
      setComment('');
      setRequestSent(true);
    } catch (error) {
      showErrorToast('Error occurred.');
      console.error('Error creating account: ' + error.response?.data?.error);
    }
  };

  return (
    <Box>
      <Banner text="Contact Us" imageHeight="250px" />
      <Box textAlign="center" mt={2}>
        <Typography variant="h4" color="#734dc4" mb={1}>Get in touch</Typography>
        <Typography variant="body2" color="text.secondary">Let us know how to get back to you</Typography>
      </Box>

      {requestSent && (
        <Typography variant="subtitle1" color="success.main" textAlign="center" mt={2}>
          &#10004; We have received your request!
        </Typography>
      )}

      <Box display="flex" justifyContent="center" mt={4}>
        <Paper elevation={6} sx={{ p: 4, width: { xs: '90%', md: '60%' }, borderRadius: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
              <Box flex={1}>
                <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth margin="normal" inputProps={{ maxLength: 50 }} required/>
                <TextField label="Email Address"  value={email} onChange={(e) => setEmail(e.target.value)} type="email" fullWidth margin="normal" inputProps={{ maxLength: 50 }} required/>
                <TextField label="Subject" value={subject}onChange={(e) => setSubject(e.target.value)} fullWidth margin="normal" inputProps={{ maxLength: 100 }}required/>
              </Box>

              <Box flex={1}>
                <TextField label="Comments/Questions" value={comment} onChange={(e) => setComment(e.target.value)} multiline rows={7} fullWidth margin="normal" required/>
              </Box>
            </Box>

            <Box textAlign="left" mt={2}>
              <Button variant="contained" type="submit" sx={{ backgroundColor: '#734dc4','&:hover': { backgroundColor: '#5a3ca8' },}}>SUBMIT </Button>
            </Box>
          </form>
        </Paper>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default ContactUsMU;
