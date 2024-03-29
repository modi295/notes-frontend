import React from 'react'

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
        <nav class="nav nav-pills">
          <a href="/your-actual-url-1" class="nav-link text-black my-2">Search Notes</a>
          <a href="/your-actual-url-2" class="nav-link text-black my-2">Sell Your Notes</a>
          <a href="/your-actual-url-3" class="nav-link text-black my-2">FAQ</a>
          <a href="/your-actual-url-4" class="nav-link text-black my-2">Contact Us</a>
          <a href="/login" class="nav-link btn btn-sm" style={linkStyle}>Login</a>
        </nav>
      </div>
    </header>
  )
}

export default Navigation