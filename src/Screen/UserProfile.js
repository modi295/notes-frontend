import React from 'react'
import Banner from '../Component/banner';

function UserProfile() {
  return (
    <div>
    <Banner text="User Profile" imageHeight="250px" />

    <div className="container d-flex justify-content-center">
      <form className="col-md-8">
      <h1 style={{ color: '#734dc4',paddingTop: '15px', fontSize: '24px' }}>Basic Profile Details</h1>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="name">First Name<span className="required">*</span></label>
              <input type="text" className="form-control" id="first name" placeholder="Enter your first name" required/>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email <span className="required">*</span></label>
              <input type="email" className="form-control" id="email" placeholder="Enter your email address" required/>
            </div>
            <div className="form-group">
              <label htmlFor="Gender">Gender<span className="required">*</span></label>
              <select className="form-control" id="gender" name="gender" >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
          <div className="form-group">
              <label htmlFor="name">Last Name<span className="required">*</span></label>
              <input type="text" className="form-control" id="lastname" placeholder="Enter your Last name" required/>
            </div>
            <div className="form-group">
              <label htmlFor="DOB">Date Of Birth <span className="required">*</span></label>
              <input type="date" className="form-control" id="dob" placeholder="Enter your date of birth" required/>
            </div>
            <div className="form-group">
              <label htmlFor="Phone Number">Phone Number<span className="required">*</span></label>
              <input type="text" className="form-control" id="number" placeholder="Enter your phone number" required/>
            </div>
          </div>
        </div>
        <h1 style={{ color: '#734dc4',paddingTop: '10px', fontSize: '24px' }}>Address Details</h1>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="address1">Address Line 1<span className="required">*</span></label>
              <input type="text" className="form-control" id="address1" placeholder="Enter your address" required/>
            </div>
            <div className="form-group">
              <label htmlFor="city">City<span className="required">*</span></label>
              <input type="text" className="form-control" id="city" placeholder="Enter your city" required/>
            </div>
            <div className="form-group">
              <label htmlFor="zipcode">Zipcode<span className="required">*</span></label>
              <input type="text" className="form-control" id="zipcode" placeholder="Enter your zipcode" required/>
            </div>
          </div>
          <div className="col-md-6">
          <div className="form-group">
              <label htmlFor="address2">Address Line 2<span className="required">*</span></label>
              <input type="text" className="form-control" id="address2" placeholder="Enter your address" required/>
            </div>
            <div className="form-group">
              <label htmlFor="state">State<span className="required">*</span></label>
              <input type="text" className="form-control" id="state" placeholder="Enter your state" required/>
            </div>
            <div className="form-group">
              <label htmlFor="subject">Country<span className="required">*</span></label>
              <input type="text" className="form-control" id="country" placeholder="Enter your country" required/>
            </div>
          </div>
        </div>
        <h1 style={{ color: '#734dc4',paddingTop: '10px', fontSize: '24px' }}>University and collage information</h1>
        <div className="row">
        <div className="col-md-6">
          <div className="form-group">
              <label htmlFor="university">University<span className="required">*</span></label>
              <input type="text" className="form-control" id="university" placeholder="Enter your University" required/>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="collage">Collage<span className="required">*</span></label>
              <input type="text" className="form-control" id="collage" placeholder="Enter your Collage" required/>
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