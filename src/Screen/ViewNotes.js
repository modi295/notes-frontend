import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../Services/api';
import { getUserEmail, isLoggedIn, getUserRole } from '../Services/auth';
import { useNavigate } from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import { showAlert, showConfirm } from '../Utility/ConfirmBox'; 
import { showSuccessToast, showErrorToast } from '../Utility/ToastUtility';
import Loading from '../Utility/Loading';


function ViewNotes() {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [supportImage, setSupportImage] = useState(null);
    const navigate = useNavigate();
    const isAdmin = getUserRole() === 'Admin' || getUserRole() === 'SAdmin';

    const postBuyerNote = async (note) => {
        try {
            const email = getUserEmail();
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

            console.log("Buyer Note Data: ", data);

            const response = await api.post('/buyernotes', data);

            if (response.data.success) {
                // Initiate PayU payment here
                //initiatePayUPayment(note.sellPrice, note.noteTitle); 
                showAlert('Please complete the payment to access the notes. Once the payment is successful, the notes will be available for download in your account.',"info");
            } else {
                showAlert('There was an error with your purchase. Please try again.',"error");
            }
        } catch (error) {
            console.error(error);
            showAlert('An error occurred while processing your request.',"error");
        }
    };

    // const initiatePayUPayment = (amount, productInfo) => {
    //     const key = 'YOUR_MERCHANT_KEY';
    //     const salt = 'YOUR_SALT'; 
    //     const txnid = generateTxnId();
    //     const firstname = getUserEmail().split('@')[0]; 
    //     const email = getUserEmail();
    //     const productinfo = productInfo;
    //     const phone = '9988776633';
    //     const surl = `${window.location.origin}/payment-success`; 
    //     const furl = `${window.location.origin}/payment-failure`; 

    //     const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
        
    //     const hash = calculateHash(hashString); 

    //     // Create form and submit to PayU
    //     const form = document.createElement('form');
    //     form.action = 'https://test.payu.in/_payment'; 
    //     form.method = 'POST';

    //     const fields = {
    //         key: key,
    //         txnid: txnid,
    //         amount: amount,
    //         productinfo: productinfo,
    //         firstname: firstname,
    //         email: email,
    //         phone: phone,
    //         surl: surl,
    //         furl: furl,
    //         hash: hash
    //     };

    //     for (const key in fields) {
    //         const hiddenField = document.createElement('input');
    //         hiddenField.type = 'hidden';
    //         hiddenField.name = key;
    //         hiddenField.value = fields[key];
    //         form.appendChild(hiddenField);
    //     }

    //     document.body.appendChild(form);
    //     form.submit();
    // };

    // const generateTxnId = () => {
    //     return 'TXN' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // };

    // const calculateHash = (hashString) => {
    //     return CryptoJS.SHA512(hashString).toString(CryptoJS.enc.Hex);
    // };

    const postDownloadNote = async (note) => {
        try {
            const email = getUserEmail();

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

            if (note.sellPrice > 0) {
                data.PurchaseTypeFlag = 'U';
            }

            console.log("Download Note Data: ", data); // Log the data being sent

            await api.post('/downloadnotes', data);
        } catch (error) {
            console.error(error);
            showAlert('An error occurred while processing your request.',"error");
        }
    };

    const postSoldNote = async (note) => {
        try {
            const email = getUserEmail();
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

            console.log("Sold Note Data: ", data); // Log the data being sent

            await api.post('/soldnotes', data);
        } catch (error) {
            console.error(error);
            showAlert('An error occurred while processing your request.',"error");
        }
    };

    const handleDeleteReview = async (downloadNoteId) => {
        if (isAdmin) {
            try {
                const response = await api.put(`/downloadNote/${downloadNoteId}`, { // Ensure the API endpoint is correct
                    rating: null,
                    comment: null,
                });
    
                if (response.data.success) {
                    showSuccessToast('Review deleted successfully');
                    setReviews(prevReviews => prevReviews.filter(review => review.id !== downloadNoteId));
                } else {
                    showErrorToast('Failed to delete review.');
                    console.error('Failed to delete review:', response.data.message);
                }
            } catch (error) {
                console.error('Error deleting review:', error);
                showErrorToast('An error occurred while deleting the review.');
            }
        }
    };
    const handleDownloadClick = async () => {
        if (!isLoggedIn()) {
            navigate('/login');
        } else {
            if (isAdmin) {
                const confirmed = await showConfirm("Do you really want to download this Note?");
                if (!confirmed) return;
                window.open(note.notesAttachmentP, '_blank');
                return; 
            }

            if (note.sellFor === 'free') {
                postDownloadNote(note);
                postSoldNote(note);
                window.open(note.notesAttachmentP, '_blank');
            } else {
                const confirmed = await showConfirm("This note is paid. Do you want to proceed with the purchase?");
                if (confirmed) {
                    postBuyerNote(note);
                }
            }
        }
    };

    const fetchSupportInfo = async () => {
        try {
            const response = await api.get('/support');
            setSupportImage(response.data.noteImage); // Assuming the field is named noteImage
        } catch (error) {
            console.error('Error fetching support info:', error);
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
        const fetchReviews = async () => {
            try {
                const response = await api.get(`/reviewdownloadnotesbyId/${id}`);
                const formattedReviews = response.data.map((review) => {
                    if (review.profilePicture && review.profilePicture.data) {
                        const imageData = new Uint8Array(review.profilePicture.data);
                        const base64Image = arrayBufferToBase64(imageData);
                        return {
                            ...review,
                            profilePicture: `data:image/png;base64,${base64Image}`,
                        };
                    }
                    return review;
                });
                setReviews(formattedReviews);
                if (response.data.length > 0) {
                    setAverageRating(response.data[0].averageRating);
                } else {
                    setAverageRating(null);
                }
               
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        fetchReviews();
        fetchNote();
        fetchSupportInfo();
    }, [id]);

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };
    if (!note) {
        return <Loading />;
    }
    const renderStars = (rating) => {
        let stars = '';
        for (let i = 0; i < 5; i++) {
          stars += i < rating ? '★' : '☆';
        }
        return <span style={{ color: '#deeb34' }}>{stars}</span>;
      };

      const generateAverageRatingStars = (averageRating) => {
        if (averageRating === null || averageRating === undefined) {
            return 'No Ratings';
        }
        const roundedRating = Math.round(averageRating);
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += i < roundedRating ? '★' : '☆';
        }
        return <span style={{ color: '#deeb34',fontSize:'24px' }}>{stars}</span>;
    };


    return (
        <div>
            <h5 style={{ paddingTop: 110, paddingLeft: 100, color: '#734dc4', fontSize: '20px' }}>Notes Details</h5>
            <div className="container">
                <div className="row d-flex ">
                    <div className="col-md-3">
                        <img src={note.displayPictureP ? note.displayPictureP : supportImage} alt="Notes" className="img-fluid" height={500} width={500} />
                    </div>
                    <div className="col-md-4">
                        <h1 style={{ color: '#734dc4', fontSize: '40px' }} >{note.noteTitle}</h1>
                        <h4 style={{ color: '#734dc4', fontSize: '18px' }}>{note.category}</h4>
                        <p><strong>Description:</strong>{note.notesDescription}</p>
                        <button className="btn btn-sm" onClick={handleDownloadClick} style={{ backgroundColor: '#734dc4', color: 'white' }}>DOWNLOAD/${note.sellPrice}</button>
                    </div>
                    <div className="col-md-3" style={{ paddingLeft: 60 }}>
                        <p>Institution</p>
                        <p>Country</p>
                        <p>Course Name</p>
                        <p>Course Code</p>
                        <p>Professor</p>
                        <p>Number Of Pages</p>
                        <p>Approved Date</p>
                        <p>Rating</p>
                        <p> <span style={{ color: 'red' }}>{note.reportCount} user reported this note</span></p>
                    </div>
                    <div className="col-md-2 text-end">
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{note.universityInformation}</p>
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{note.country}</p>
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{note.courseInformation}</p>
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{note.courseCode}</p>
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{note.professorLecturer}</p>
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{note.numberOfPages}</p>
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{new Date(note.updatedAt).toLocaleDateString()}</p>
                        <p style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>
                            {generateAverageRatingStars(averageRating)} {averageRating !== null && averageRating !== undefined ? `${averageRating} Ratings` : ''}
                        </p>
                    </div>
                </div>
            </div>
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
                <hr style={{ border: 'none', borderTop: '2px solid #ccc', width: 'calc(100% - 200px)', margin: '0 auto' }} />
            </div>

            <div style={{ paddingLeft: 100, paddingRight: 100, paddingBottom: 30 }}>
                <div className="row">
                    <div className="col-md-6" style={{ paddingRight: 100 }}>
                        <h5 style={{ paddingTop: 50, color: '#734dc4', fontSize: '20px' }}>Notes Preview</h5>
                        <iframe
                            src={note.previewUploadP}
                            title="My Resume"
                            style={{ width: '100%', height: '300px', border: '1px solid #000' }}
                        ></iframe>
                    </div>
                    <div className="col-md-6">
                        <h5 style={{ paddingTop: 50, color: '#734dc4', fontSize: '20px' }}>Customer Review</h5>
                        <div
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '5px',
                                padding: '15px',
                                marginBottom: '20px',
                                overflowY: 'auto',
                                maxHeight: '300px',
                                width: '500px',
                            }}
                        >
                            {reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <div key={index} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flexGrow: 1 }}>
                                            <div className="row">
                                                <div className="col-sm-4">
                                                    <img
                                                        src={review.profilePicture}
                                                        alt={review.name}
                                                        className="rounded-circle img-fluid"
                                                        style={{ width: '70px', height: '70px' }}
                                                    />
                                                </div>
                                                <div className="col-sm-8">
                                                    <p style={{ margin: '0', fontSize: '14px' }}>{review.buyerName}</p>
                                                    <h5 style={{ margin: '0', fontSize: '20px' }}>
                                                        {renderStars(review.rating)} {review.rating} out of 5 stars
                                                    </h5>
                                                    <p style={{ margin: '0', fontSize: '14px' }}>{review.comment}</p>
                                                </div>
                                            </div>
                                        </div>
                                        {isAdmin && (
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteReview(review.id)}
                                                style={{ marginLeft: '10px', height: '30px' }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                        {index < reviews.length - 1 && <hr style={{ margin: '8px 0' }} />}
                                    </div>
                                ))
                            ) : (
                                <p>No reviews available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ViewNotes