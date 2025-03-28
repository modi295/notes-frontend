import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const EditAdministrator = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    phoneNumberCode: '+91',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/users/${email}`);
        setUser(response.data);
      } catch (error) {
        toast.error('Failed to fetch user details.');
      }
    };
    fetchUser();
  }, [email]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!user.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!user.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!user.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(user.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digit Number';
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

    try {
      await api.put(`/users/${email}`, user);
      toast.success('User updated successfully');
      setTimeout(() => navigate('/administrator'), 2000);
    } catch (error) {
      toast.error('Failed to update user. Please try again.');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', marginTop: '50px', marginLeft: '100px' }}>
      <div style={{ width: '400px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h2 style={{ color: '#673ab7', marginBottom: '20px' }}>Edit Administrator</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>First Name <span className="required">*</span></label>
            <input type="text" name="firstName" value={user.firstName} onChange={handleChange} placeholder="Enter first name" maxLength="100"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Last Name<span className="required">*</span></label>
            <input
              type="text" name="lastName" value={user.lastName} onChange={handleChange} placeholder="Enter last name" maxLength="100"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Phone Number<span className="required">*</span></label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <select style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' }}
                name="phoneNumberCode" value={user.phoneNumberCode} onChange={handleChange}
              >
                <option value="+91">+91</option>
              </select>
              <input
                type="tel" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} placeholder="Enter phone number" maxLength="10"
                style={{ flex: '1', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            {errors.phoneNumber && <p style={{ color: 'red' }}>{errors.phoneNumber}</p>}
          </div>

          <button
            type="submit" style={{ width: '70%', padding: '10px', backgroundColor: '#673ab7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} > UPDATE
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAdministrator;