import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import { isLoggedIn, logout, getUserEmail, getUserRole } from '../Services/auth';
import { showConfirm } from '../Utility/ConfirmBox';
import api from '../Services/api';

function Navigation() {
  const navigate = useNavigate();
  const [anchorElNotes, setAnchorElNotes] = useState(null);
  const [anchorElSetting, setAnchorElSetting] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const isAdmin = getUserRole() === 'Admin' || getUserRole() === 'SAdmin';
  const isSAdmin = getUserRole() === 'SAdmin';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = getUserEmail();
        const userResponse = await api.get(`/users/${userEmail}`);
        const userData = userResponse.data;

        if (userData.profilePicture?.data) {
          const imageData = new Uint8Array(userData.profilePicture.data);
          const base64Image = arrayBufferToBase64(imageData);
          setProfilePicture(`data:image/png;base64,${base64Image}`);
        } else {
          const supportResponse = await api.get(`/support`);
          const supportData = supportResponse.data;
          if (supportData.profilePicture) {
            setProfilePicture(supportData.profilePicture);
          }
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    if (isLoggedIn()) {
      fetchUserData();
    }
  }, []);

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleLogout = async () => {
    const confirm = await showConfirm('Are you sure you want to logout?');
    if (confirm) {
      logout();
      navigate('/login');
    }
  };

  const buttonStyle = {
    color: 'black',
    textTransform: 'none',
    fontWeight: 500,
    '&:hover': { color: '#555' }
  };

  return (
    <AppBar position="fixed" elevation={1} sx={{ backgroundColor: 'white', color: 'black' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/">
          <img src="/Logo.png" alt="Notes Marketplace Logo" height="40" />
        </Link>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isLoggedIn() ? (
            <>
              {isAdmin ? (
                <>
                  <Button component={Link} to="/adminDashboard" sx={buttonStyle}>Dashboard</Button>

                  <Box
                    onMouseEnter={(e) => setAnchorElNotes(e.currentTarget)}
                    onMouseLeave={() => setAnchorElNotes(null)}
                  >
                    <Button sx={buttonStyle}>Notes</Button>
                    <Menu
                      anchorEl={anchorElNotes}
                      open={Boolean(anchorElNotes)}
                      onClose={() => setAnchorElNotes(null)}
                      MenuListProps={{ onMouseLeave: () => setAnchorElNotes(null) }}
                    >
                      <MenuItem component={Link} to="/underReview">Notes Under Review</MenuItem>
                      <MenuItem component={Link} to="/publishNotes">Published Notes</MenuItem>
                      <MenuItem component={Link} to="/alldownloadNotes">Downloaded Notes</MenuItem>
                      <MenuItem component={Link} to="/rejectedNotes">Rejected Notes</MenuItem>
                    </Menu>
                  </Box>

                  <Button component={Link} to="/member" sx={buttonStyle}>Member</Button>
                  <Button component={Link} to="/spamReport" sx={buttonStyle}>Reports</Button>

                  {isSAdmin && (
                    <Box
                      onMouseEnter={(e) => setAnchorElSetting(e.currentTarget)}
                      onMouseLeave={() => setAnchorElSetting(null)}
                    >
                      <Button sx={buttonStyle}>Setting</Button>
                      <Menu
                        anchorEl={anchorElSetting}
                        open={Boolean(anchorElSetting)}
                        onClose={() => setAnchorElSetting(null)}
                        MenuListProps={{ onMouseLeave: () => setAnchorElSetting(null) }}
                      >
                        <MenuItem component={Link} to="/support">Manage System Configuration</MenuItem>
                        <MenuItem component={Link} to="/administrator">Manage Administrator</MenuItem>
                        <MenuItem component={Link} to="/lookup">Lookup</MenuItem>
                        <MenuItem component={Link} to="/alldownloadNotes">Downloaded Notes</MenuItem>
                        <MenuItem component={Link} to="/rejectedNotes">Rejected Notes</MenuItem>
                      </Menu>
                    </Box>
                  )}
                </>
              ) : (
                <>
                  <Button component={Link} to="/searchNote" sx={buttonStyle}>Search Notes</Button>
                  <Button component={Link} to="/sellNotes" sx={buttonStyle}>Sell Your Notes</Button>
                  <Button component={Link} to="/BuyRequest" sx={buttonStyle}>Buyers Request</Button>
                  <Button component={Link} to="/faq" sx={buttonStyle}>FAQ</Button>
                  <Button component={Link} to="/contactUs" sx={buttonStyle}>Contact Us</Button>
                </>
              )}

              <IconButton onClick={(e) => setAnchorElProfile(e.currentTarget)}>
                <Avatar src={profilePicture} sx={{ width: 38, height: 38 }} />
              </IconButton>
              <Menu
                anchorEl={anchorElProfile}
                open={Boolean(anchorElProfile)}
                onClose={() => setAnchorElProfile(null)}
              >
                <MenuItem component={Link} to="/userProfile">{isAdmin ? 'Update Profile' : 'My Profile'}</MenuItem>
                {!isAdmin && (
                  <>
                    <MenuItem component={Link} to="/downloadNotes">My Downloads</MenuItem>
                    <MenuItem component={Link} to="/soldNotes">My Sold Notes</MenuItem>
                    <MenuItem component={Link} to="/myRejectedNotes">My Rejected Notes</MenuItem>
                  </>
                )}
                <MenuItem component={Link} to="/changePassword">Change Password</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>

              <Button
                onClick={handleLogout}
                variant="contained"
                sx={{
                  backgroundColor: '#734dc4',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#5e38b0' }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/searchNote" sx={buttonStyle}>Search Notes</Button>
              <Button component={Link} to="/sellNotes" sx={buttonStyle}>Sell Your Notes</Button>
              <Button component={Link} to="/faq" sx={buttonStyle}>FAQ</Button>
              <Button component={Link} to="/contactUs" sx={buttonStyle}>Contact Us</Button>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{
                  backgroundColor: '#734dc4',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#5e38b0' }
                }}
              >
                Login
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
