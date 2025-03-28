import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Login.css'
import api from '../Services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false); // State for registration success
    const [passwordsMatchError, setPasswordsMatchError] = useState(false);
    const [passwordLengthError, setPasswordLengthError] = useState(false);

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword); // Toggle confirm password visibility
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle password visibility
    };
    const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[^\s]{6,24}$/;

    const checkEmailExists = async (email) => {
        try {
            const response = await api.get(`/users/${email}`);
            return response.data;
        } catch (error) {
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const existingUser = await checkEmailExists(email);

        if (existingUser) {
            toast.warn('Email already exists. Please use a different email.', {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        if (!strongPasswordRegex.test(password)) {
            setPasswordLengthError(true); // Update error message to mention specific requirements
            return;
        }
        if (password !== confirmPassword) {
            setPasswordsMatchError(true); // Set error state
            return;
        }
        try {
            await api.post('/register', { firstName, lastName, email, password });
            setRegistrationSuccess(true); // Set registration success state
            setPasswordsMatchError(false);
            toast.success('Register successfully', {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setTimeout(() => {
                navigate(`/login`);
            }, 4000);
            // navigate('/login'); 
        } catch (error) {
            alert('Error creating account: ' + error.response.data.error);
        }
    };

    return (
        <div className="register-container">
            <div className="row">
                <div className="logo">
                    <img src="top-logo.png" alt="Logo" />
                </div>
                <div className="col-md-12 d-flex justify-content-center align-items-center ">
                    <div className="register-form ">
                        <div className="login-text">
                            <h1 >Create an Account</h1>
                            <p >Enter your details to SignUp</p>
                        </div>
                        {registrationSuccess && ( // Conditionally render success message
                            <p className="login-success">
                                <span className="tick" style={{ color: 'green' }}>&#10004;</span> Your account has been successfully created!
                                <br />
                                <span className="tick" style={{ color: 'green' }}>&#10004;</span> Email Sent. Please verify it!
                            </p>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="text">First Name<span className="required">*</span></label>
                                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control" placeholder="Enter your First name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Last Name<span className="required">*</span></label>
                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control" placeholder="Enter your Last name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email Address<span className="required">*</span></label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Enter your Email" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password<span className="required">*</span></label>
                                <div className="password-container">
                                    <input type={showPassword ? 'text' : 'password'} maxLength={24} value={password} onChange={(e) => { setPassword(e.target.value); setPasswordLengthError(false); }} placeholder="Enter Password" className="form-control" required />
                                    <i className={`fas fa-eye${showPassword ? '' : '-slash'}`} onClick={togglePasswordVisibility}></i>
                                </div>
                                {passwordLengthError && (
                                    <div className="error-message" style={{ color: 'red' }}>
                                        Password must be at least 6to 24 characters long with UpperCase,Lowercase,Number and Special Characters!
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Confirm Password<span className="required">*</span></label>
                                <div className="password-container">
                                    <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setPasswordsMatchError(false); }} placeholder="Confirm Password" className="form-control" required />
                                    <i className={`fas fa-eye${showConfirmPassword ? '' : '-slash'}`} onClick={toggleConfirmPasswordVisibility} ></i>
                                </div>
                                {passwordsMatchError && (
                                    <div className="error-message" style={{ color: 'red' }}>
                                        Passwords do not match!
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="btn-login">
                                SIGN UP
                            </button>
                            <div className="text-muted">
                                Already have an account? <Link to="/login" className='link'>Login</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register