import React from 'react'
import '../css/Login.css'

function Login() {
    return (
        <div className="login-container">
            <div className="row">
                <div className="logo">
                <img src="top-logo.png" alt="Logo" />
                </div>
                <div className="col-md-12 d-flex justify-content-center align-items-center ">
                    <div className="login-form">
                        <form action="l" method="post">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email"className="form-control" placeholder="Enter your Email" required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <a href="k" className="text-muted forgot-password"> Forgot Password?</a>
                                <input type="password" id="password" className="form-control" placeholder="password" required/>
                                
                            </div>
                            <div className="form-group form-check">
                                <input type="checkbox" className="form-check-input" id="rememberMe" />
                                <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
                            </div>
                            <button type="submit" className="btn-login">
                                LOGIN
                            </button>
                            <div className="text-muted">
                                Don't have an account? <a href="m">Sign Up</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login