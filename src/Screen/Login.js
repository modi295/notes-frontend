import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css';
import api from '../Services/api';
import Cookies from 'js-cookie'; 
import CryptoJS from 'crypto-js';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false); 
    const secretKey = 'YourSecretEncryptionKey'; 

    const encrypt = (data) => {
      return CryptoJS.AES.encrypt(data, secretKey).toString();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            const { token, role } = response.data; // Get role from response

            if (rememberMe) {
                Cookies.set('token', token, { expires: 2 });
                Cookies.set('email', encrypt(email), { expires: 2 });
                Cookies.set('role', encrypt(role), { expires: 2 });
              } else {
                Cookies.set('token', token, { expires: 1 / 48 });
                Cookies.set('email', encrypt(email), { expires: 1 / 48 });
                Cookies.set('role', encrypt(role), { expires: 1 / 48 });
              }
          

            console.log("Login successfully");
            setLoginSuccess(true);
            navigate('/userprofile');
            window.location.reload();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const errorMessageFromServer = error.response.data.error;

                if (errorMessageFromServer.includes('User not found')) {
                    setErrorMessage('User not found. Please check your email.');
                } else if (errorMessageFromServer.includes('Invalid password')) {
                    setErrorMessage('Invalid password. Please try again.');
                } else if (errorMessageFromServer.includes('deactivated')) {
                    setErrorMessage('Your ID has been deactivated. Please contact Admin.');
                } else {
                    setErrorMessage('An error occurred during login.');
                }
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
                            <h1>Login</h1>
                            <p>Enter your Email Address and Password to Login</p>
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
                                </div>
                            </div>
                            <div className="form-group form-check">
                                <input type="checkbox" className="form-check-input" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
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