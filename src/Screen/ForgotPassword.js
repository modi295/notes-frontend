import React, { useState} from 'react';
import '../css/Login.css';
import api from '../Services/api';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await api.post('/auth/forgotPassword', {email});
            setPasswordUpdateSuccess(true); 
            console.log("mail sent");
        } catch (error) {
            alert('Error in sending email: ' + error.response.data.error);
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
                    <h1 >Forgot Password?</h1>
                    <p >Enter your Email Address to reset password</p>
                </div>
                {passwordUpdateSuccess && ( // Conditionally render success message
                            <p className="login-success">
                                <span className="tick" style={{ color: 'green' }}>&#10004;</span> Your New Password send over the Mail Address!
                            </p>
                        )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address<span className="required">*</span></label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="Enter your Email" required />
                    </div>
                    <button type="submit" className="btn-login">
                        SUBMIT
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
  )
}

export default ForgotPassword