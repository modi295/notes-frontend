import React from 'react'
import Banner from '../Component/banner';
import Dropdown from '../Component/dropdown';
import Footer from '../Component/footer';




function Faq() {
  return (<div>
    <Banner text="Frequently Asked Question" imageHeight="250px" />
    <h1 className='faq-text'>General Questions</h1>
    <Dropdown question = "What is Marketplace-Notes?" answer = "default answer" id="1"/>
    <Dropdown question = "What do the university say?" answer = "default answer" id="2"/>
    <Dropdown question = "Is this legal?" answer = "default answer" id="3" />
    <h1 className='faq-text'>Uploaders</h1>
    <Dropdown question = "What can't I sell?" answer = "default answer" id="4"/>
    <Dropdown question = "What notes can I sell?" answer = "default answer" id="5"/>
    
    <h1 className='faq-text'>Downloaders</h1>
    <Dropdown question = "How do I buy notes?" answer = "default answer" id="6"/>
    <Dropdown question = "can I edit the notes I purchased?" answer = "default answer" id="7"/>
    <Footer />
  </div>

  )
}

export default Faq