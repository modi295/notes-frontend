import React, { useState } from 'react';
import api from '../Services/api';
import { toast,ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddLookup = () => {
  const navigate = useNavigate();
  const [typeCode, setTypeCode] = useState('');
  const [typeId, setTypeId] = useState('');
  const [typeName, settypeName] = useState('');
  const [errors, setErrors] = useState({});

  const typeCodeOptions = [
    { key: 'CON', value: 'Country' },
    { key: 'CAT', value: 'Category' },
    { key: 'TYP', value: 'Types' }
  ];

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!typeCode) {
      newErrors.typeCode = 'Type Code is required';
      isValid = false;
    }

    if (!typeId.trim()) {
      newErrors.typeId = 'Type ID is required';
      isValid = false;
    } else if (!/^\d{3}$/.test(typeId)) {
      newErrors.typeId = 'Type ID must be a 3-digit number';
      isValid = false;
    }

    if (!typeName.trim()) {
      newErrors.typeName = 'typeName is required';
      isValid = false;
    } else if (typeName.length > 40) {
      newErrors.typeName = 'typeName cannot exceed 40 characters';
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
    const finalTypeId = typeCode + typeId;

    try {
      await api.post('/createLookup', {
        typeCode,
        typeId: finalTypeId,
        typeName
      });

      toast.success('Lookup added successfully', {
        position: 'bottom-right',
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate(`/lookup`);
      }, 4000);
    } catch (error) {
      toast.error('Failed to save lookup. Please try again.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', marginTop: '50px', marginLeft: '100px' }}>
      <ToastContainer />
      <div style={{ width: '400px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h2 style={{ color: '#673ab7', marginBottom: '20px' }}>Add Lookup</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type Code <span className="required">*</span></label>
            <select value={typeCode} onChange={(e) => setTypeCode(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="">Select Type Code</option>
              {typeCodeOptions.map(option => (
                <option key={option.key} value={option.key}>{option.value}</option>
              ))}
            </select>
            {errors.typeCode && <p style={{ color: 'red' }}>{errors.typeCode}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type ID <span className="required">*</span></label>
            <input type="text" value={typeId} onChange={(e) => setTypeId(e.target.value)} placeholder="Enter 3-digit Type ID" maxLength="3"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            {errors.typeId && <p style={{ color: 'red' }}>{errors.typeId}</p>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>typeName <span className="required">*</span></label>
            <input type="text" value={typeName} onChange={(e) => settypeName(e.target.value)} placeholder="Enter typeName (Max 40 chars)" maxLength="40"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            {errors.typeName && <p style={{ color: 'red' }}>{errors.typeName}</p>}
          </div>

          <button type="submit" style={{ width: '70%', padding: '10px', backgroundColor: '#673ab7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}> SUBMIT</button>
        </form>
      </div>
    </div>
  );
};

export default AddLookup;
