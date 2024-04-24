import React, { useState } from 'react';
import api from '../Services/api';
import '../css/Login.css';

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordsMatchError, setPasswordsMatchError] = useState(false);
    const [passwordLengthError, setPasswordLengthError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const toggleOldPasswordVisibility = () => {
        setShowOldPassword(!showOldPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[^\s]{6,24}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!strongPasswordRegex.test(newPassword)) {
            setPasswordLengthError(true);
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordsMatchError(true);
            return;
        }

        try {
            const email = localStorage.getItem('email');
            await api.put('/changePassword', { email, oldPassword, newPassword });
            setSuccessMessage('Password updated successfully');
            setErrorMessage('');
            setPasswordsMatchError(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setErrorMessage('Error updating password: ' + error.response.data.error);
            setSuccessMessage('');
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
                            <h1 >Change Password</h1>
                            <p >Enter Old Password to change Password</p>
                        </div>
                        {successMessage && (
                            <p className="login-success">{successMessage}</p>
                        )}
                        {errorMessage && (
                            <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="oldPassword">Old Password<span className="required">*</span></label>
                                <div className="password-container">
                                    <input type={showOldPassword ? 'text' : 'password'} maxLength={24} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Enter Old Password" className="form-control" required />
                                    <i className={`fas fa-eye${showOldPassword ? '' : '-slash'}`} onClick={toggleOldPasswordVisibility}></i>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password<span className="required">*</span></label>
                                <div className="password-container">
                                    <input type={showNewPassword ? 'text' : 'password'} maxLength={24} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter New Password" className="form-control" required />
                                    <i className={`fas fa-eye${showNewPassword ? '' : '-slash'}`} onClick={toggleNewPasswordVisibility}></i>
                                </div>
                                {passwordLengthError && (
                                    <div className="error-message" style={{ color: 'red' }}>
                                        Password must be at least 6 to 24 characters long with UpperCase, Lowercase, Number and Special Characters!
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm New Password<span className="required">*</span></label>
                                <div className="password-container">
                                    <input type={showConfirmPassword ? 'text' : 'password'} maxLength={24} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" className="form-control" required />
                                    <i className={`fas fa-eye${showConfirmPassword ? '' : '-slash'}`} onClick={toggleConfirmPasswordVisibility}></i>
                                </div>
                                {passwordsMatchError && (
                                    <div className="error-message" style={{ color: 'red' }}>
                                        Passwords do not match!
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="btn-login">
                                SUBMIT
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>

    );
}

export default ChangePassword;
