import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../Services/auth';


function Protected(props) {
    const { Component , access = false } = props;
    const navigate = useNavigate();
    useEffect(() => {
         const userEmail = localStorage.getItem('email');
       

        if (!(isLoggedIn())) {
            navigate('/login');
        } else {
            if (access && !canAccessComponent(userEmail, window.location.pathname)) {
                alert("you don't have rights to access this page")
                navigate('/');
            }
        }
    }, [navigate,access]);

    const canAccessComponent = (email, path) => {
        if ((path === '/contactUs' || path === '/faq'|| path === '/sellNotes') && email !== 'Admin@gmail.com') {
            return false;
        }
        return true;
    };
    return (
        <div>
            <Component />
        </div>
    )
}

export default Protected