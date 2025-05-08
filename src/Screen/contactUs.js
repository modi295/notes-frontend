import React, { useState } from 'react';
import Banner from '../Component/banner';
import api from '../Services/api';
import '../css/Login.css'
import { getUserEmail } from '../Services/auth';
import { ToastContainer } from 'react-toastify';
import { showErrorToast } from '../Utility/ToastUtility';

function ContactUs() {
  const [fullName, setFullName] = useState('');
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState(getUserEmail());
  const [comment, setComment] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contact', { fullName, subject, email, comment });
      setFullName('');
      setSubject('');
      setEmail('');
      setComment('');
      setRequestSent(true);

    } catch (error) {
      showErrorToast('Error Occur.');
      console.error('Error creating account: ' + error.response.data.error);
    }
  }
  return (
    <div>
      <Banner text="Contact Us" imageHeight="250px" />
      <h1 style={{ color: '#734dc4', marginLeft: '335px', paddingTop: '10px', fontSize: '30px' }}>Get in touch</h1>
      <p style={{ color: 'black', marginLeft: '335px', fontSize: 'small' }}>Let us know How to get back to you</p>
      {requestSent && (
        <p className="login-success">
          <span className="tick" style={{ color: 'green' }}>&#10004;</span> We have recived your request!
        </p>
      )}
      <div className="container d-flex justify-content-center">
        <form onSubmit={handleSubmit} className="col-md-8">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="name">Full Name<span className="required">*</span></label>
                <input type="text" maxLength={50} value={fullName} onChange={(e) => setFullName(e.target.value)} className="form-control" id="name" placeholder="Enter your full name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address<span className="required">*</span></label>
                <input type="email" maxLength={50} value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" placeholder="Enter your email address" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject<span className="required">*</span></label>
                <input type="text" maxLength={100} value={subject} onChange={(e) => setSubject(e.target.value)} className="form-control" id="subject" placeholder="Enter your subject" required />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="comments">Comments/Questions<span className="required">*</span></label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="form-control" id="comments" rows="6" placeholder="Comments" required></textarea>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 pt-2 text-start"> <button style={{ backgroundColor: '#734dc4', color: 'white' }} type="submit" className=" btn btn-sm">SUBMIT</button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}

export default ContactUs