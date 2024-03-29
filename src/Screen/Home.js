import React from 'react'
import Banner from '../Component/banner';
import PeopleList from '../Component/peopleList';
import Footer from '../Component/footer';



function Home() {
    const linkStyle1 = {
        borderRadius: "100%", backgroundColor: "white", display: "inline-block", padding: "30px"
    };
    const cardStyle = {
        backgroundColor: "#f2f3f5"
    };
    const buttonStyle = {
        backgroundColor: '#734dc4',
        color: 'white',
    };
   
    return (
        <div>
            <Banner text="Welcome to our Learning Platform!" imageHeight="300px" />
            <div class="container mt-3">
                <div class="text-container">
                    <h1>About Notes Marketplace</h1>
                </div>
                <div class="right-column">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <p>Excepteur sint occaecat cupidatat non proident, suntin culpa qui officia deserunt mollit anim id est laborum sed ut perspiciatis unde
                        omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                    </p>

                </div>
            </div>
            <div class="d-flex justify-content-center">
                <div class="card text-center w-100" style={cardStyle}>
                    <div class="card-body row">
                        <h2 class='p-text'>How It Works</h2>
                        <div class="col-md-6">
                            <div style={linkStyle1}>
                                <img src="download.png" alt="Download Icon" class="img-fluid " />
                            </div>
                            <h3 class='p-text'>Download Free/Paid course</h3>
                            <p>Get material for your course</p>
                            <button type="button" class="btn" style={buttonStyle}>DOWNLOAD</button>
                        </div>
                        <div class="col-md-6">
                            <div style={linkStyle1}>
                                <img src="seller.png" alt="Seller Icon" class="img-fluid " />
                            </div>
                            <h3 class='p-text'>Seller</h3>
                            <p>Upload and download Course and Materials</p>
                            <button type="button" class="btn" style={buttonStyle}>SELL BOOK</button>
                        </div>
                    </div>
                </div>
            </div>
            <h1 class='c-text'>What our Customer are Saying</h1>
            <PeopleList />
            <Footer />
            
        </div>
    )
}

export default Home