import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { isLoggedIn, logout } from '../Services/auth';
import api from '../Services/api';
import '../css/Navigation.css';
import { useNavigate } from 'react-router-dom';
import { getUserEmail, getUserRole } from '../Services/auth';
import { showConfirm } from '../Utility/ConfirmBox';
import ThemeContext from "../Utility/ThemeContext";
import { FormControlLabel, Switch } from "@mui/material";


function Navigation() {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);
  const isAdmin = getUserRole() === 'Admin' || getUserRole() === 'SAdmin';
  const isSAdmin = getUserRole() === 'SAdmin';
  const { mode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userEmail = getUserEmail();
        const userResponse = await api.get(`/users/${userEmail}`);
        const userData = userResponse.data;

        if (userData.profilePicture && userData.profilePicture.data) {
          const imageData = new Uint8Array(userData.profilePicture.data);
          const base64Image = arrayBufferToBase64(imageData);
          setProfilePicture(`data:image/png;base64,${base64Image}`);
        } else {
          // Fallback: Get from Support API if user profile picture is not present
          const supportResponse = await api.get(`/support`);
          const supportData = supportResponse.data;

          if (supportData.profilePicture) {
            setProfilePicture(supportData.profilePicture); // Use direct image URL
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

  const linkStyle = {
    backgroundColor: '#734dc4',
    color: 'white',
    margin: '10px',
  };
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
    const confirmLogout = await showConfirm('Are you sure you want to logout?');
    if (confirmLogout) {
      logout();
      navigate('/login');
    }
  };

  if (isLoggedIn()) {
    return (
      <header className="fixed-top bg-light shadow-sm">
        <div className="container d-flex align-items-center">
          <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
            <img src="\Logo.png" alt="Notes Marketplace Logo" className="img-fluid" height="40" />
          </a>
          <nav className="nav nav-pills">
            {isAdmin ? (
              <>
                <Link to="/adminDashboard" className="nav-link text-black my-2">Dashboard</Link>
                <div className="dropdown">
                  <button className="btn nav-link text-black my-2" id="notesDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    Notes
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="notesDropdown">
                    <li><Link to="/underReview" className="dropdown-item">Notes Under Review</Link></li>
                    <li><Link to="/publishNotes" className="dropdown-item">Published Notes</Link></li>
                    <li><Link to="/alldownloadNotes" className="dropdown-item">Downloaded Notes</Link></li>
                    <li><Link to="/rejectedNotes" className="dropdown-item">Rejected Notes</Link></li>
                  </ul>
                </div>
                <Link to="/member" className="nav-link text-black my-2">Member</Link>
                <Link to="/spamReport" className="nav-link text-black my-2">Reports</Link>
                {isSAdmin && (
                  <div className="dropdown">
                    <button className="btn nav-link text-black my-2" id="notesDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                      Setting
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="notesDropdown">
                      <li><Link to="/support" className="dropdown-item">Manage System Configuration</Link></li>
                      <li><Link to="/administrator" className="dropdown-item">Manage Administrator</Link></li>
                      <li><Link to="/lookup" className="dropdown-item">Lookup</Link></li>
                      <li><Link to="/alldownloadNotes" className="dropdown-item">Downloaded Notes</Link></li>
                      <li><Link to="/rejectedNotes" className="dropdown-item">Rejected Notes</Link></li>
                    </ul>
                  </div>
                )}
                <div className="dropdown" style={{ paddingTop: '10px', paddingBottom: '1px' }}>
                  <div className="dropdown-toggle" role="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={profilePicture} alt="Profile" className="rounded-circle img-fluid" width="38" height="38" />
                  </div>
                  <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                    <li><Link to="/userProfile" className="dropdown-item">Update Profile</Link></li>
                    <li><Link to="/changePassword" className="dropdown-item" href="/">Change Password</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item logout-btn" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              </>
            ) : (
              // Links for Regular Users
              <>
                <Link to="/searchNote" className="nav-link text-black my-2">Search Notes</Link>
                <Link to="/sellNotes" className="nav-link text-black my-2">Sell Your Notes</Link>
                <Link to="/BuyRequest" className="nav-link text-black my-2">Buyers Request</Link>
                <Link to="/faq" className="nav-link text-black my-2">FAQ</Link>
                <Link to="/contactUs" className="nav-link text-black my-2">Contact Us</Link>
                <div className="dropdown" style={{ paddingTop: '10px', paddingBottom: '1px' }}>
                  <div className="dropdown-toggle" role="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={profilePicture} alt="Profile" className="rounded-circle img-fluid" width="38" height="38" />
                  </div>
                  <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                    <li><Link to="/userProfile" className="dropdown-item">My Profile</Link></li>
                    <li><Link to="/downloadNotes" className="dropdown-item" href="/">My Downloads</Link></li>
                    <li><Link to="/soldNotes" className="dropdown-item" href="/">My Sold Notes</Link></li>
                    <li><Link to="/myRejectedNotes" className="dropdown-item" href="/">My Rejected Notes</Link></li>
                    <li><Link to="/changePassword" className="dropdown-item">Change Password</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item logout-btn" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              </>
            )}

            <button onClick={handleLogout} className="nav-link btn btn-sm" style={linkStyle}>Logout</button>
            <FormControlLabel control={<Switch checked={mode === "dark"} onChange={toggleTheme} color="secondary" />}/>
          </nav>
        </div>
      </header>

    );
  } else {
    return (
      <header className="fixed-top bg-light shadow-sm">
        <div className="container d-flex align-items-center">
          <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
            <img src="\Logo.png" alt="Notes Marketplace Logo" className="img-fluid" height="40" />
          </a>
          <nav className="nav nav-pills">
            <Link to="/searchNote" className="nav-link text-black my-2">Search Notes</Link>
            <Link to="/sellNotes" className="nav-link text-black my-2">Sell Your Notes</Link>
            <Link to="/faq" className="nav-link text-black my-2">FAQ</Link>
            <Link to="/contactUs" className="nav-link text-black my-2">Contact Us</Link>
            <Link to="/login" className="nav-link btn btn-sm" style={linkStyle}>Login</Link>
            <FormControlLabel control={<Switch checked={mode === "dark"} onChange={toggleTheme} color="secondary" />}/>
          </nav>
        </div>
      </header>
    );
  }
}

export default Navigation;