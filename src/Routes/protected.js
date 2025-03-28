import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../Services/auth';
import { getUserRole } from '../Services/auth';

function Protected(props) {
  const { Component, access = false } = props;
  const navigate = useNavigate();
  const isAdmin = getUserRole() === 'Admin'|| getUserRole() === 'SAdmin';
  
  const canAccessComponent = useCallback((path) => {
    if ((path === '/contactUs' || path === '/faq' || path === '/sellNotes') && !isAdmin) {
      return false;
    }
    return true;
  }, [isAdmin]); // Only re-create when isAdmin changes

  useEffect(() => {
    if (!(isLoggedIn())) {
      navigate('/login');
    } else {
      if (access && !canAccessComponent(window.location.pathname)) {
        alert("you don't have rights to access this page");
        navigate('/');
      }
    }
  }, [navigate, access, canAccessComponent]);

  return (
    <div>
      <Component />
    </div>
  );
}

export default Protected;