import React, { useState, useEffect } from 'react';
import Banner from '../Component/banner';
import api from '../Services/api';
import { getUserEmail, getUserRole } from '../Services/auth';
import { ToastContainer } from 'react-toastify';
import { showSuccessToast, showErrorToast } from '../Utility/ToastUtility';
import {
    Box, TextField, Typography, Button, Paper, MenuItem, Select, InputLabel, FormControl, Avatar, Input
} from '@mui/material';

function UserProfile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberCode, setPhoneNumberCode] = useState('+91');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');
    const [university, setUniversity] = useState('');
    const [college, setCollege] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const isAdmin = getUserRole() === 'Admin' || getUserRole() === 'SAdmin';

    useEffect(() => {
        setEmail(getUserEmail());
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/users/${getUserEmail()}`);
                const data = response.data;
                setFirstName(data.firstName || '');
                setLastName(data.lastName || '');
                setGender(data.gender || '');
                setDob(data.dob || '');
                setPhoneNumber(data.phoneNumber || '');
                setAddress1(data.address1 || '');
                setAddress2(data.address2 || '');
                setCity(data.city || '');
                setState(data.state || '');
                setZipCode(data.zipCode || '');
                setCountry(data.country || '');
                setUniversity(data.university || '');
                setCollege(data.college || '');

                if (data.profilePicture?.data) {
                    const byteArray = new Uint8Array(data.profilePicture.data);
                    const base64 = arrayBufferToBase64(byteArray);
                    setProfilePicture(`data:image/png;base64,${base64}`);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value.replace(/[^a-zA-Z ]/g, ''));
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value.replace(/[^a-zA-Z ]/g, ''));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('gender', gender);
            formData.append('dob', dob);
            formData.append('phoneNumber', phoneNumber);
            formData.append('phoneNumberCode', phoneNumberCode);
            formData.append('address1', address1);
            formData.append('address2', address2);
            formData.append('city', city);
            formData.append('state', state);
            formData.append('zipCode', zipCode);
            formData.append('country', country);
            formData.append('university', university);
            formData.append('college', college);
            if (profilePicture instanceof File) {
                formData.append('profilePicture', profilePicture);
            }

            await api.put(`/users/${email}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showSuccessToast('User updated successfully!');
            setTimeout(() => window.location.reload(), 3000);
        } catch (error) {
            console.error('Update failed:', error);
            showErrorToast('Error updating user profile.');
        }
    };

    return (
        <Box>
            <Banner text={isAdmin ? 'Admin User Profile' : 'User Profile'} imageHeight="250px" />
            <Box display="flex" justifyContent="center" mt={4}>
                <Paper elevation={4} sx={{ p: 4, width: { xs: '95%', md: '70%' }, borderRadius: 3 }}>
                    <Typography variant="h5" color="#734dc4" mb={2}>Basic Profile Details</Typography>
                    <form onSubmit={handleSubmit}>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                            <Box flex={1}>
                                <TextField label="First Name" value={firstName} onChange={handleFirstNameChange} fullWidth required />
                                <TextField label="Email" value={email} disabled fullWidth margin="normal" />
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel>Gender</InputLabel>
                                    <Select value={gender} onChange={(e) => setGender(e.target.value)} label="Gender">
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button variant="outlined" component="label" sx={{ mt: 2, display: 'flex', alignItems: 'center',color:'#734dc4' }}>
                                    <Input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        sx={{ display: 'none' }} 
                                    />
                                    Upload Profile Picture
                                </Button>
                               
                            </Box>
                            <Box flex={1}>
                                <TextField label="Last Name" value={lastName} onChange={handleLastNameChange} fullWidth required />
                                <TextField type="date" sx={{ marginBottom: 3 }} label="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
                                <Box display="flex" gap={1}>
                                    <FormControl sx={{ width: '30%' }} required>
                                        <InputLabel>Code</InputLabel>
                                        <Select value={phoneNumberCode} onChange={(e) => setPhoneNumberCode(e.target.value)} label="Code">
                                            <MenuItem value="+91">+91</MenuItem>
                                            <MenuItem value="+92">+92</MenuItem>
                                            <MenuItem value="+93">+93</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField type="tel" label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} fullWidth inputProps={{ maxLength: 10 }} required />
                                </Box>
                                {profilePicture && typeof profilePicture === 'string' && (
                                    <Avatar src={profilePicture} sx={{ width: 48, height: 48, ml: 2,mt:2 }} />
                                )}
                            </Box>
                        </Box>

                        {!isAdmin && (
                            <>
                                <Typography variant="h6" color="#734dc4" mt={4}>Address Details</Typography>
                                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                                    <Box flex={1}>
                                        <TextField label="Address Line 1" value={address1} onChange={(e) => setAddress1(e.target.value)} fullWidth required />
                                        <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth margin="normal" required />
                                        <TextField label="Zip Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} fullWidth margin="normal" required />
                                    </Box>
                                    <Box flex={1}>
                                        <TextField label="Address Line 2" value={address2} onChange={(e) => setAddress2(e.target.value)} fullWidth required />
                                        <TextField label="State" value={state} onChange={(e) => setState(e.target.value)} fullWidth margin="normal" required />
                                        <TextField label="Country" value={country} onChange={(e) => setCountry(e.target.value)} fullWidth margin="normal" required />
                                    </Box>
                                </Box>

                                <Typography variant="h6" color="#734dc4" mt={4}>University & College Info</Typography>
                                <Box display="flex" gap={3}>
                                    <TextField label="University" value={university} onChange={(e) => setUniversity(e.target.value)} fullWidth required />
                                    <TextField label="College" value={college} onChange={(e) => setCollege(e.target.value)} fullWidth required />
                                </Box>
                            </>
                        )}

                        <Box mt={4} textAlign="left">
                            <Button type="submit" variant="contained" sx={{ backgroundColor: '#734dc4', '&:hover': { backgroundColor: '#5a3ca8' } }}>
                                SUBMIT
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default UserProfile;
