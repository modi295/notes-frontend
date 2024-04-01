import React from 'react'
import Banner from '../Component/banner';



function contactUs() {
  return (
    <div>
    <Banner text="Contact Us" imageHeight="250px" />
    <h1 style={{ color: '#734dc4',marginLeft: '335px',paddingTop: '10px',fontSize: '30px' }}>Get in touch</h1>
    <p style={{ color: 'black',marginLeft: '335px',fontSize: 'small' }}>Let us know How to get back to you</p>
    <div className="container d-flex justify-content-center"> <form className="col-md-8"> <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="name">Full Name*</label>
            <input type="text" className="form-control" id="name" placeholder="Enter your full name"/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address*</label>
            <input type="email" className="form-control" id="email" placeholder="Enter your email address"/>
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject*</label>
            <input type="text" className="form-control" id="subject" placeholder="Enter your subject"/>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="comments">Comments/Questions*</label>
            <textarea className="form-control" id="comments" rows="6" placeholder="Comments"></textarea>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 pt-2 text-start"> <button style={{ backgroundColor: '#734dc4',color: 'white' }} type="submit" className=" btn btn-sm">SUBMIT</button>
        </div>
      </div>
    </form>
  </div>
  </div>
  )
}

export default contactUs