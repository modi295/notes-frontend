import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Services/api';
import { toast,ToastContainer } from 'react-toastify';

const EditLookup = () => {
  const { typeId } = useParams();
  const navigate = useNavigate();
  const [lookup, setLookup] = useState({ typeCode: '', typeId: '', typeName: '' });
  const [errors, setErrors] = useState({});

  const typeCodeOptions = [
      { key: 'CON', value: 'Country' },
      { key: 'CAT', value: 'Category' },
      { key: 'TYP', value: 'Types' }
  ];

  const getTypeCodeValue = (code) => {
      const option = typeCodeOptions.find(opt => opt.key === code);
      return option ? option.value : code; // Return value if found, else return the code itself
  };

  useEffect(() => {
    const fetchLookup = async () => {
      try {
        const response = await api.get(`/getLookupById/${typeId}`);
        setLookup(response.data);
      } catch (error) {
        toast.error('Failed to fetch lookup details.', {
          position: 'bottom-right',
          autoClose: 3000,
        });
      }
    };
    fetchLookup();
  }, [typeId]);

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    if (!lookup.typeName.trim()) {
      newErrors.typeName = 'Type Name is required';
      isValid = false;
    } else if (lookup.typeName.length > 40) {
      newErrors.typeName = 'Type Name cannot exceed 40 characters';
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
      await api.put(`/updateLookup/${typeId}`, {
        typeName: lookup.typeName
      });

      toast.success('Lookup updated successfully', {
        position: 'bottom-right',
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate(`/lookup`);
      }, 4000);
    } catch (error) {
      toast.error('Failed to update lookup. Please try again.', {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex', marginTop: '50px', marginLeft: '100px' }}>
       <ToastContainer />
      <div style={{ width: '400px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h2 style={{ color: '#673ab7', marginBottom: '20px' }}>Edit Lookup</h2>
        <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type Code</label>
                        <input type="text" value={getTypeCodeValue(lookup.typeCode)} disabled style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#e9ecef' }} />
                    </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type ID</label>
            <input type="text" value={lookup.typeId} disabled style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#e9ecef' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type Name <span className="required">*</span></label>
            <input type="text" value={lookup.typeName} onChange={(e) => setLookup({ ...lookup, typeName: e.target.value })} placeholder="Enter Type Name (Max 40 chars)" maxLength="40"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            {errors.typeName && <p style={{ color: 'red' }}>{errors.typeName}</p>}
          </div>

          <button type="submit" style={{ width: '70%', padding: '10px', backgroundColor: '#673ab7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}> UPDATE</button>
        </form>
      </div>
    </div>
  );
};

export default EditLookup;
