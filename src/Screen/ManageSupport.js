import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import api from '../Services/api';
import 'react-toastify/dist/ReactToastify.css';
import { showErrorToast, showSuccessToast } from '../Utility/ToastUtility';

function ManageSupport() {
  const [support, setSupport] = useState(null);
  const [previewNoteImage, setPreviewNoteImage] = useState(null);
  const [previewProfileImage, setPreviewProfileImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const fetchSupport = useCallback(async () => {
    try {
      const response = await api.get('/support');
      setSupport(response.data);
      if (response.data) {
        setValue('supportEmail', response.data.supportEmail);
        setValue('supportPhone', response.data.supportPhone);
        setValue('emailAddress', response.data.emailAddress);
        setValue('facebookUrl', response.data.facebookUrl);
        setValue('twitterUrl', response.data.twitterUrl);
        setValue('linkedinUrl', response.data.linkedinUrl);
      }
    } catch (error) {
      showErrorToast('Error fetching support info');
    }
  }, [setValue]);

  useEffect(() => {
    fetchSupport();
  }, [fetchSupport]);

  const handleNoteImageChange = (event) => {
    const file = event.target.files[0];
    setPreviewNoteImage(URL.createObjectURL(file));
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    setPreviewProfileImage(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('supportEmail', data.supportEmail);
      formData.append('supportPhone', data.supportPhone);
      formData.append('emailAddress', data.emailAddress);
      formData.append('facebookUrl', data.facebookUrl);
      formData.append('twitterUrl', data.twitterUrl);
      formData.append('linkedinUrl', data.linkedinUrl);

      if (data.noteImage?.[0]) formData.append('noteImage', data.noteImage[0]);
      if (data.profilePicture?.[0]) formData.append('profilePicture', data.profilePicture[0]);

       await api.put(`/support`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccessToast('Support info updated successfully');
      fetchSupport();
    } catch (error) {
      showErrorToast('Failed to update support info');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', display: 'flex',marginTop: '50px', marginLeft: '100px' }}>
      <ToastContainer />
      <div style={{ width: '500px',padding: '20px', backgroundColor: 'white',borderRadius: '8px' }} >
        <h2 style={{ color: '#673ab7', marginBottom: '20px' }}>Manage Support Info</h2>

        {support ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Support Email</label>
              <input
                type="email"
                maxLength={60}
                {...register('supportEmail', { required: 'Support Email is required'})}
                defaultValue={support.supportEmail}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              {errors.supportEmail && <span style={{ color: 'red' }}>{errors.supportEmail.message}</span>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Support Phone</label>
              <input
                type="text"
                maxLength={10}
                {...register('supportPhone', {
                  required: 'Support Phone is required',
                  maxLength: { value: 10, message: 'Phone number cannot exceed 10 digits' },
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Phone number must be exactly 10 digits',
                  },
                })}
                defaultValue={support.supportPhone}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              {errors.supportPhone && <span style={{ color: 'red' }}>{errors.supportPhone.message}</span>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email Address</label>
              <input
                type="email"
                maxLength={60}
                {...register('emailAddress', { required: 'Email Address is required' })}
                defaultValue={support.emailAddress}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              {errors.emailAddress && <span style={{ color: 'red' }}>{errors.emailAddress.message}</span>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Facebook URL</label>
              <input
                type="url"
                maxLength={120}
                {...register('facebookUrl')}
                defaultValue={support.facebookUrl}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Twitter URL</label>
              <input
                type="url"
                maxLength={120}
                {...register('twitterUrl')}
                defaultValue={support.twitterUrl}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>LinkedIn URL</label>
              <input
                type="url"
                maxLength={120}
                {...register('linkedinUrl')}
                defaultValue={support.linkedinUrl}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div
              style={{ marginBottom: '15px', display: 'flex',  alignItems: 'center',justifyContent: 'space-between' }}

            >
              <div style={{ flex: 1, marginRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Default Image for Notes</label>
                <input
                  type="file"
                  {...register('noteImage')}
                  onChange={handleNoteImageChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              {(previewNoteImage || support.noteImage) && (
                <img
                  src={previewNoteImage || support.noteImage}
                  alt="Note Preview"
                  style={{ width: '60px',height: '60px',borderRadius: '4px', objectFit: 'cover' }}
                />
              )}
            </div>

            {/* Profile Picture */}
            <div
              style={{ marginBottom: '15px', display: 'flex',  alignItems: 'center',justifyContent: 'space-between' }}
            >
              <div style={{ flex: 1, marginRight: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Default Profile Picture</label>
                <input
                  type="file"
                  {...register('profilePicture')}
                  onChange={handleProfileImageChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>
              {(previewProfileImage || support.profilePicture) && (
                <img
                  src={previewProfileImage || support.profilePicture}
                  alt="Profile Preview"
                  style={{width: '60px', height: '60px',borderRadius: '4px',objectFit: 'cover' }}
                />
              )}
            </div>

            <button type="submit" style={{width: '20%', padding: '10px', backgroundColor: '#673ab7',  color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', }} >SUBMIT</button>
          </form>
        ) : (
          <p>Loading support information...</p>
        )}
      </div>
    </div>
  );
}

export default ManageSupport;
