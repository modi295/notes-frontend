import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


function Protected(props) {
    const { Component } = props;
    const navigate = useNavigate();
    useEffect(() => {
        const userEmail = localStorage.getItem('email');
        const userToken = localStorage.getItem('token');

        if (!(userEmail && userToken)) {
            navigate('/login');
        } else {
            // Additional validation for accessing FAQ component
            if (!canAccessComponent(userEmail, window.location.pathname)) {
                alert("you don't have rights to access this page")
                navigate('/');
            }
        }
    }, [navigate]);

    const canAccessComponent = (email, path) => {
        if ((path === '/contactUs' || path === '/faq') && email !== 'Admin@gmail.com') {
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