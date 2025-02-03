import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isLoggedIn, logout } from '../Services/auth';
import api from '../Services/api';
import '../css/Navigation.css';
import { useNavigate } from 'react-router-dom';


function Navigation() {
  const navigate = useNavigate();
  // const [userFirstName, setUserFirstName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Fetch user data based on the email from the server when user is logged in
    const fetchUserData = async () => {
      try {
        const userEmail = localStorage.getItem('email');
        setUserEmail(userEmail);
        const response = await api.get(`/users/${userEmail}`);
        const userData = response.data;
        // setUserFirstName(userData.firstName);
        if (userData.profilePicture && userData.profilePicture.data) {
          const imageData = new Uint8Array(userData.profilePicture.data); // Convert buffer data to Uint8Array
          const base64Image = arrayBufferToBase64(imageData); // Convert Uint8Array to base64
          setProfilePicture(`data:image/png;base64,${base64Image}`);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
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

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure, you want to logout?');
    if (confirmLogout) {
      logout();
      navigate('/login');
    }
  };

  if (isLoggedIn()) {
    return (
      // <header className="fixed-top bg-light shadow-sm">
      //   <div className="container d-flex align-items-center">
      //     <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
      //       <img src="\Logo.png" alt="Notes Marketplace Logo" className="img-fluid" height="40" />
      //     </a>
      //     <nav className="nav nav-pills">
      //       <Link to="/searchNote" className="nav-link text-black my-2">Search Notes</Link>
      //       <a href="/your-actual-url-2" className="nav-link text-black my-2">Sell Your Notes</a>
      //       <a href="/your-actual-url-2" className="nav-link text-black my-2">Buyers Request</a>
      //       <Link to="/faq" className="nav-link text-black my-2">FAQ</Link>
      //       <Link to="/contactUs" className="nav-link text-black my-2">Contact Us</Link>
      //       {/* {userFirstName && (
      //         <span className="nav-link text-black my-2">Hello, {userFirstName}</span>
      //       )} */}
      //        {profilePicture && (
      //         <div style={{ paddingTop:'10px', paddingBottom:'1px' }}>
      //         <img src={profilePicture} alt="Profile" className="rounded-circle img-fluid" width="38" height="38" /> 
      //         </div>                        
      //        )}
      //       <button onClick={handleLogout} className="nav-link btn btn-sm" style={linkStyle}>Logout</button>
      //     </nav>
      //   </div>
      // </header>
      <header className="fixed-top bg-light shadow-sm">
        <div className="container d-flex align-items-center">
          <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
            <img src="\Logo.png" alt="Notes Marketplace Logo" className="img-fluid" height="40" />
          </a>
          <nav className="nav nav-pills">
            {userEmail === 'Admin@gmail.com' ? (
              <>
                <Link to="/adminDashboard" className="nav-link text-black my-2">Dashboard</Link>
                <div className="dropdown">
                  <button className="btn nav-link text-black my-2" id="notesDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    Notes
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="notesDropdown">
                    <li><Link to="/adminDashboard" className="dropdown-item">Notes Under Review</Link></li>
                    <li><Link to="/adminNotes" className="dropdown-item">Published Notes</Link></li>
                    <li><Link to="/adminMembers" className="dropdown-item">Downloaded Notes</Link></li>
                    <li><Link to="/adminReports" className="dropdown-item">Rejected Notes</Link></li>
                  </ul>
                </div>
                <Link to="/adminDashboard" className="nav-link text-black my-2">Member</Link>
                <Link to="/adminDashboard" className="nav-link text-black my-2">Reports</Link>
                <Link to="/adminDashboard" className="nav-link text-black my-2">Setting</Link>
                <div className="dropdown" style={{ paddingTop: '10px', paddingBottom: '1px' }}>
                  <div className="dropdown-toggle" role="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={profilePicture} alt="Profile" className="rounded-circle img-fluid" width="38" height="38" />
                  </div>
                  <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                    <li><Link to="/userProfile" className="dropdown-item">Update Profile</Link></li>
                    <li><Link to="/downloadNotes" className="dropdown-item" href="/">Change Password</Link></li>
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
                    <li><a className="dropdown-item" href="/">My Rejected Notes</a></li>
                    <li><Link to="/changePassword" className="dropdown-item">Change Password</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item logout-btn" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              </>
            )}

            <button onClick={handleLogout} className="nav-link btn btn-sm" style={linkStyle}>Logout</button>
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
          </nav>
        </div>
      </header>
    );
  }
}

export default Navigation;