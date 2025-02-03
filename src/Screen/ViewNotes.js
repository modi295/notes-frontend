import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Services/api';
import { isLoggedIn } from '../Services/auth';
import { useNavigate } from 'react-router-dom';

function ViewNotes() {
    const { id } = useParams();
    const [note, setNote] = useState(null);

    const navigate = useNavigate();
  
    const postBuyerNote = async (note) => {
        try {
            const email = localStorage.getItem('email'); 
            const data = {
                email,
                noteId: note.id,
                noteTitle: note.noteTitle,
                category: note.category,
                sellFor: note.sellFor,
                sellPrice: note.sellPrice,
                purchaseEmail: note.email,
                buyerEmail: email
            };
            
            console.log("Buyer Note Data: ", data); // Log the data being sent
    
            const response = await api.post('/buyernotes', data);
    
            if (response.data.success) {
                alert('Please complete the payment to access the notes. Once the payment is successful, the notes will be available for download in your account.');
                // Proceed to download or other actions
            } else {
                alert('There was an error with your purchase. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while processing your request.');
        }
    };
    
    const postDownloadNote = async (note) => {
        try {
            const email = localStorage.getItem('email'); 
            
            const data = {
                email,
                noteId: note.id,
                noteTitle: note.noteTitle,
                category: note.category,
                sellFor: note.sellFor,
                sellPrice: note.sellPrice,
                purchaseEmail:note.email,
                buyerEmail: email
            };
            
            if (note.sellPrice > 0) {
                data.PurchaseTypeFlag = 'U';
            }
    
            console.log("Download Note Data: ", data); // Log the data being sent
    
            await api.post('/downloadnotes', data);
        } catch (error) {
            console.error(error);
            alert('An error occurred while processing your request.');
        }
    };
    
    const postSoldNote = async (note) => {
        try {
            const email = localStorage.getItem('email'); 
            const data = {
                email,
                noteId: note.id,
                noteTitle: note.noteTitle,
                category: note.category,
                sellFor: note.sellFor,
                sellPrice: note.sellPrice,
                purchaseEmail:note.email,
                buyerEmail: email
            };
            
            console.log("Sold Note Data: ", data); // Log the data being sent
    
            await api.post('/soldnotes', data);
        } catch (error) {
            console.error(error);
            alert('An error occurred while processing your request.');
        }
    };
    
    const handleDownloadClick = () => {
        if (!isLoggedIn()) {
            navigate('/login');
        } else {
            if (note.sellFor === 'free') {
                postDownloadNote(note);
                postSoldNote(note);
                window.location.href = note.notesAttachmentP;
            } else {
                const userConfirmed = window.confirm('This note is paid. Do you want to proceed with the purchase?');
                if (userConfirmed) {
                    postBuyerNote(note);
                }
            }
        }
    };

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const response = await api.get(`/notesById/${id}`);
                setNote(response.data); // Assuming API response returns the note object
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching note:', error);
            }
        };

        fetchNote();
    }, [id]);

    if (!note) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h5 style={{ paddingTop: 110, paddingLeft: 100, color: '#734dc4', fontSize: '20px' }}>Notes Details</h5>
            <div className="container">
                <div className="row d-flex ">
                    <div className="col-md-3">
                        <img src={note.displayPictureP} alt="Notes" className="img-fluid" height={500} width={500} />

                    </div>
                    <div className="col-md-4">
                        <h1 style={{ color: '#734dc4', fontSize: '40px' }} >{note.noteTitle}</h1>
                        <h4 style={{ color: '#734dc4', fontSize: '18px' }}>{note.category}</h4>
                        <p><strong>Description:</strong>{note.notesDescription}</p>
                        <button className="btn btn-sm"  onClick={handleDownloadClick} style={{ backgroundColor: '#734dc4', color: 'white' }}>DOWNLOAD/${note.sellPrice}</button>
                    </div>
                    <div className="col-md-2" style={{ paddingLeft: 60 }}>
                        <p>Institution</p>
                        <p>Country</p>
                        <p>Course Name</p>
                        <p>Course Code</p>
                        <p>Professor</p>
                        <p>Number Of Pages</p>
                        <p>Approved Date</p>
                        <p>Rating</p>
                    </div>
                    <div className="col-md-2 text-end">
                        {/* <p><strong>DOWNLOAD/$15</strong></p>
          <p><strong>Rating: ★★★★☆ 100 Reviews</strong></p>
          <p><strong>5 Users marked this note as inappropriate</strong></p> */}
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{note.universityInformation}</p>
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{note.country}</p>
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{note.courseInformation}</p>
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{note.courseCode}</p>
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{note.professorLecturer}</p>
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{note.numberOfPages}</p>
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{note.updatedAt}</p>
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}><span style={{ color: '#deeb34' }}>★★★★☆</span> 100 Reviews</p>
                    </div>
                </div>
            </div>
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                <hr style={{ border: 'none', borderTop: '2px solid #ccc', width: 'calc(100% - 200px)', margin: '0 auto' }} />
            </div>

            <div className="container">
                <div className="row">

                    <div className="col-md-6" style={{ paddingRight: 100 }}>
                        <h5 style={{ paddingTop: 50, color: '#734dc4', fontSize: '20px' }}>Notes Preview</h5>
                        <iframe src={note.previewUploadP} title="My Resume" style={{ width: '100%', height: '360px', border: '1px solid #000' }}></iframe>
                    </div>
                    <div className="col-md-6">
                        <h5 style={{ paddingTop: 50, color: '#734dc4', fontSize: '20px' }}>Customer Review</h5>
                        <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '15px', marginBottom: '20px' }}>
                            <div className="row">
                                <div className="col-sm-3">
                                    <img src="/reviewer-2.png" alt="Pr" className="rounded-circle img-fluid" style={{ width: '80px', height: '80px' }} />
                                </div>
                                <div className="col-sm-9">
                                    <p style={{ margin: '0' }}>Richard Brown</p>
                                    <h5 style={{ margin: '0' }}><span style={{ color: '#deeb34' }}>★★★★☆</span> 4 out of 5 stars</h5>
                                    <p style={{ margin: '0' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                    <img src="/reviewer-1.png" alt="Profi" className="rounded-circle img-fluid" style={{ width: '80px', height: '80px' }} />
                                </div>
                                <div className="col-sm-9">
                                    <p style={{ margin: '0' }}>Richard Brown</p>
                                    <h5 style={{ margin: '0' }}><span style={{ color: '#deeb34' }}>★★★★☆</span> 4 out of 5 stars</h5>
                                    <p style={{ margin: '0' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</p>
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-3">
                                    <img src="/reviewer-3.png" alt="Prof" className="rounded-circle img-fluid" style={{ width: '80px', height: '80px' }} />
                                </div>
                                <div className="col-sm-9">
                                    <p style={{ margin: '0' }}>Richard Brown</p>
                                    <h5 style={{ margin: '0' }}><span style={{ color: '#deeb34' }}>★★★★☆</span> 4 out of 5 stars</h5>
                                    <p style={{ margin: '0' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ViewNotes