import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import '../css/Login.css';
import api from '../Services/api';
import Cookies from 'js-cookie';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false); // State for login success
    const [errorMessage, setErrorMessage] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle password visibility
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            const token = response.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            // Cookies.set('token', token, { expires: 7 }); // Expires in 7 days
            // Cookies.set('email', email);
            console.log("login successfully");
            setLoginSuccess(true); // Set login success state
        } catch (error) {

            if (error.response && error.response.status === 401) {
                const isUserNotFound = error.response.data.error.includes('User not found');
                const isInvalidPassword = error.response.data.error.includes('Invalid password');

                setErrorMessage(isUserNotFound ? 'User not found. Please check your email.' :
                    isInvalidPassword ? 'Invalid password. Please try again.' :
                        'An error occurred during login.'); // Generic error for other cases
            } else {
                setErrorMessage('An unexpected error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="row">
                <div className="logo">
                    <img src="top-logo.png" alt="Logo" />
                </div>
                <div className="col-md-12 d-flex justify-content-center align-items-center ">
                    <div className="login-form">
                        <div className="login-text">
                            <h1 >Login</h1>
                            <p >Enter your Email Address and Password to Login</p>
                        </div>
                        {loginSuccess ? (
                            <p className="login-success">Login successful!</p>
                        ) : errorMessage && (
                            <p className="error-message">{errorMessage}</p>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email Address<span className="required">*</span></label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Enter your Email" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password<span className="required">*</span></label>
                                <a href="/forgotPassword" className="text-muted forgot-password">
                                    Forgot Password?
                                </a>
                                <div className="password-container">
                                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password" className="form-control" required />
                                    <i className={`fas fa-eye${showPassword ? '' : '-slash'}`} onClick={togglePasswordVisibility}></i>
                                </div>                            </div>
                            <div className="form-group form-check">
                                <input type="checkbox" className="form-check-input" id="rememberMe" />
                                <label className="form-check-label" htmlFor="rememberMe">
                                    Remember Me
                                </label>
                            </div>
                            <button type="submit" className="btn-login">
                                LOGIN
                            </button>
                            <div className="text-muted">
                                Don't have an account? <Link to="/register" className='link'>Sign Up</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
