import React, { useState, useEffect } from 'react';
import Banner from '../Component/banner';
import api from '../Services/api';

function UserProfile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberCode, setphoneNumberCode] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setzipCode] = useState('');
    const [country, setCountry] = useState('');
    const [university, setUniversity] = useState('');
    const [college, setCollege] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const handleFirstNameChange = (event) => {
        const newFirstName = event.target.value.replace(/[^a-zA-Z ]/g, ''); // Restrict to alphabets and spaces
        setFirstName(newFirstName);
    };

    const handleLastNameChange = (event) => {
        const newLastName = event.target.value.replace(/[^a-zA-Z ]/g, ''); // Restrict to alphabets and spaces
        setLastName(newLastName);
    };
    useEffect(() => {
        const userEmail = localStorage.getItem('email');
        setEmail(userEmail);
    }, []);
    useEffect(() => {
        // Fetch user data based on the email from the server
        const fetchUserData = async () => {
            const userEmail = localStorage.getItem('email');
            try {
                const response = await api.get(`/users/${userEmail}`);
                const userData = response.data;
                setFirstName(userData.firstName);
                setLastName(userData.lastName);
                setGender(userData.gender);
                setDob(userData.dob);
                setPhoneNumber(userData.phoneNumber);
                setAddress1(userData.address1);
                setAddress2(userData.address2);
                setCity(userData.city);
                setState(userData.state);
                setzipCode(userData.zipCode);
                setCountry(userData.country);
                setUniversity(userData.university);
                setCollege(userData.college);
                if (userData.profilePicture && userData.profilePicture.data) {
                    const imageData = new Uint8Array(userData.profilePicture.data); // Convert buffer data to Uint8Array
                    const base64Image = arrayBufferToBase64(imageData); // Convert Uint8Array to base64
                    setProfilePicture(`data:image/png;base64,${base64Image}`);
                }
                console.log(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create form data to send both user data and profile picture
            const formData = new FormData();
            formData.append('profilePicture', profilePicture);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('gender', gender);
            formData.append('dob', dob);
            formData.append('phoneNumber', phoneNumber);
            formData.append('phoneNumberCode', phoneNumberCode);
            formData.append('address1', address1);
            formData.append('address2', address2);
            formData.append('city', city);
            formData.append('state', state);
            formData.append('zipCode', zipCode);
            formData.append('country', country);
            formData.append('university', university);
            formData.append('college', college);

            await api.put(`/users/${email}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("update done");
            // window.location.reload(); 
        } catch (error) {
            // Handle error
            console.error('Error updating user profile:', error);
        }
    };
    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        setProfilePicture(file);
    };
    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };
    return (
        <div>
            <Banner text="User Profile" imageHeight="250px" />

            <div className="container d-flex justify-content-center">
                <form onSubmit={handleSubmit} className="col-md-8">
                    <h1 style={{ color: '#734dc4', paddingTop: '15px', fontSize: '24px' }}>Basic Profile Details</h1>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="name">First Name<span className="required">*</span></label>
                                <input type="text" value={firstName} onChange={handleFirstNameChange} className="form-control" id="first name" placeholder="Enter your first name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email <span className="required">*</span></label>
                                <input type="email" className="form-control" id="email" placeholder="Enter your email address" value={email} readOnly required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="Gender">Gender<span className="required">*</span></label>
                                <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)} id="gender" name="gender" >
                                    <option value="">Select your gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="profilePicture">Profile Picture</label>
                                <input type="file" onChange={handleProfilePictureChange} className="form-control" id="profilePicture" accept="image/*" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="name">Last Name<span className="required">*</span></label>
                                <input type="text" value={lastName} onChange={handleLastNameChange} className="form-control" id="lastname" placeholder="Enter your Last name" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="DOB">Date Of Birth <span className="required">*</span></label>
                                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="form-control" id="dob" placeholder="Enter your date of birth" required />
                            </div>

                            <div className="row">
                                <label htmlFor="phoneNumberCode">Phone Number<span className="required">*</span></label>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <select value={phoneNumberCode} onChange={(e) => setphoneNumberCode(e.target.value)} className="form-control" id="phoneNumberCode" required>
                                            <option value="+91">+91</option>
                                            <option value="+92">+92</option>
                                            <option value="+93">+93</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-9">
                                    <div className="form-group">
                                        <input type="text" maxLength={10} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="form-control" id="phoneNumber" placeholder="Enter your phone number" required />
                                    </div>
                                </div>
                            </div>
                            {profilePicture && (
              <div style={{ paddingTop:'20px', paddingBottom:'1px' }}>
              <img src={profilePicture} alt="Profile" className="rounded-circle img-fluid" width="38" height="38" /> 
              </div>                        
             )}
                        </div>
                    </div>
                    <h1 style={{ color: '#734dc4', paddingTop: '10px', fontSize: '24px' }}>Address Details</h1>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="address1">Address Line 1<span className="required">*</span></label>
                                <input type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} className="form-control" id="address1" placeholder="Enter your address" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="city">City<span className="required">*</span></label>
                                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="form-control" id="city" placeholder="Enter your city" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="zipCode">zipCode<span className="required">*</span></label>
                                <input type="text" value={zipCode} onChange={(e) => setzipCode(e.target.value)} className="form-control" id="zipCode" placeholder="Enter your zipCode" required />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="address2">Address Line 2<span className="required">*</span></label>
                                <input type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} className="form-control" id="address2" placeholder="Enter your address" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="state">State<span className="required">*</span></label>
                                <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="form-control" id="state" placeholder="Enter your state" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Country<span className="required">*</span></label>
                                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="form-control" id="country" placeholder="Enter your country" required />
                            </div>
                        </div>
                    </div>
                    <h1 style={{ color: '#734dc4', paddingTop: '10px', fontSize: '24px' }}>University and collage information</h1>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="university">University<span className="required">*</span></label>
                                <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} className="form-control" id="university" placeholder="Enter your University" required />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label htmlFor="collage">Collage<span className="required">*</span></label>
                                <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} className="form-control" id="collage" placeholder="Enter your Collage" required />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 pt-2 text-start"> <button style={{ backgroundColor: '#734dc4', color: 'white' }} type="submit" className=" btn btn-sm">SUBMIT</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserProfile