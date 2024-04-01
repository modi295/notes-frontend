import React from 'react'
import { Link } from 'react-router-dom';

function Navigation() {
  const linkStyle = {
    backgroundColor: '#734dc4',
    color: 'white',
    margin: '10px',
  };

  return (
    <header className="fixed-top bg-light shadow-sm ">
      <div className="container d-flex align-items-center">
        <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
          <img src="\Logo.png" alt="Notes Marketplace Logo" className="img-fluid" height="40" />
        </a>
        <nav className="nav nav-pills">
          <Link to="/searchNote" className="nav-link text-black my-2">Search Notes</Link>
          <a href="/your-actual-url-2" className="nav-link text-black my-2">Sell Your Notes</a>
          <Link to="/faq" className="nav-link text-black my-2">FAQ</Link>
          <Link to="/contactUs" className="nav-link text-black my-2">Contact Us</Link>
          <a href="/login" className="nav-link btn btn-sm" style={linkStyle}>Login</a>
        </nav>
      </div>
    </header>
  )
}

export default Navigation