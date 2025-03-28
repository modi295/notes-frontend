import React, { useState } from 'react';
import api from '../Services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddAdministrator = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberCode, setPhoneNumberCode] = useState('+91');
  const [errors, setErrors] = useState({});

  const checkEmailExists = async (email) => {
    try {
      const response = await api.get(`/users/${email}`);
      return response.data;
    } catch (error) {
      return null;
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

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

    try {
      await api.post('/admin', {
        firstName,
        lastName,
        email,
        phoneNumberCode,
        phoneNumber,
      });
      console.log('Form submitted:', {
        firstName,
        lastName,
        email,
        phoneNumber,
        phoneNumberCode,
      });

      toast.success('User added successfully', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        navigate(`/administrator`);
      }, 4000);
    } catch (error) {
      toast.error('Failed to save user. Please try again.', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', marginTop: '50px', marginLeft: '100px' }}>
      <div style={{ width: '400px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h2 style={{ color: '#673ab7', marginBottom: '20px' }}>Add Administrator</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="firstName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>First Name<span className="required">*</span></label>
            <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your first name" maxLength="100"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}

          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="lastName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Last Name <span className="required">*</span></label>
            <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" maxLength="100"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}

          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email<span className="required">*</span></label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" maxLength="100"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}

          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="phoneNumber" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <select
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", marginRight: "10px" }}
                value={phoneNumberCode}
                onChange={(e) => setPhoneNumberCode(e.target.value)}
              >
                <option value="+91">+91</option>
              </select>
              <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter your phone number" maxLength="10"
                style={{ flex: '1', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
            {errors.phoneNumber && <p style={{ color: 'red' }}>{errors.phoneNumber}</p>}

          </div>

          <button type="submit" style={{ width: '70%', padding: '10px', backgroundColor: '#673ab7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}> SUBMIT</button>
        </form>
      </div>
    </div>
  );
};

export default AddAdministrator;
