import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../css/grid.css';
import { useNavigate } from 'react-router-dom';
import { getUserEmail } from '../Services/auth';
import api from '../Services/api';
import { ToastContainer } from 'react-toastify';
import { showAlert, showConfirm } from '../Utility/ConfirmBox';
import { showSuccessToast, showErrorToast } from '../Utility/ToastUtility';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from "dayjs";
import { toWords } from 'number-to-words';

function MyDownload() {
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [reviewNoteId, setReviewNoteId] = useState(null);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState([false, false, false, false, false]);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState([]);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportNoteId, setReportNoteId] = useState(null);
    const [ReportRemark, setReportRemark] = useState('');
    const [reportNoteTitle, setReportNoteTitle] = useState('');

    const columns = [
        {
            name: "SR NO.",
            selector: (row, index) => index + 1,
            sortable: false,
            width: '100px'
        },
        {
            name: "NOTE TITLE",
            cell: (row) => (
                <span
                    style={{ color: '#734dc4', cursor: 'pointer' }}
                    onClick={() => handleView(row.noteId)}
                >
                    {row.noteTitle}
                </span>
            ),
            sortable: true,
            width: '200px'
        },
        {
            name: "CATEGORY",
            selector: (row) => row.category,
            sortable: true,
            width: '190px'
        },
        {
            name: "Buyer",
            selector: (row) => row.buyerEmail,
            sortable: true,
            width: '200px'
        },
        {
            name: "SELL TYPE",
            selector: (row) => row.sellFor,
            sortable: true,
            width: '130px'
        },
        {
            name: "PRICE",
            selector: (row) => `$${row.sellPrice}`,
            sortable: true,
            width: '130px'
        },
        {
            name: "ADDED DATE",
            selector: (row) => {
                const createdAt = new Date(row.createdAt);
                const day = createdAt.getDate().toString().padStart(2, '0');
                const month = (createdAt.getMonth() + 1).toString().padStart(2, '0');
                const year = createdAt.getFullYear();
                return `${day}-${month}-${year}`;
            },
            sortable: true,
            width: '190px'
        },
        {
            name: "ACTION",
            cell: (row) => (
                <div
                    style={{ position: 'relative', cursor: 'pointer' }}
                    onMouseEnter={() => setActiveDropdown(row.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                >
                    <img
                        src="dots.png"
                        alt="Action"
                        style={{ cursor: 'pointer' }}
                    />
                    {activeDropdown === row.id && (
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '0',
                            background: '#fff',
                            boxShadow: '0px 0px 5px rgba(0,0,0,0.2)',
                            borderRadius: '5px',
                            width: '180px',
                            zIndex: 10
                        }}>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                <li
                                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #ddd' }}
                                    onClick={() => handleDownload(row.Note.notesAttachmentP)}
                                >
                                    Download Notes
                                </li>
                                <li
                                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #ddd' }}
                                    onClick={() => handleDownloadInvoice(row)}
                                >
                                    Download Invoice
                                </li>

                                <li
                                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #ddd' }}
                                    onClick={() => handleAddReview(row.id)}
                                >
                                    Add Review/Feedback
                                </li>
                                <li
                                    style={{
                                        padding: '10px',
                                        cursor: row.ReportRemark ? 'not-allowed' : 'pointer',
                                        borderBottom: '1px solid #ddd',
                                        opacity: row.ReportRemark ? 0.5 : 1
                                    }}
                                    onClick={() => !row.ReportRemark && handleAddReport(row.id, row.noteTitle)}
                                    title={row.ReportRemark ? 'Already Reported' : 'Report as Inappropriate'}
                                >
                                    Report as Inappropriate
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            ),
            width: '120px'
        }
    ];

    const fetchData = async () => {
        try {
            const email = getUserEmail();
            const response = await api.get(`/downloadnotes/${email}`);

            if (response.data.message) {
                setData([]);
                setFilter([]);
            } else {
                setData(response.data);
                setFilter(response.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
            setFilter([]);
        }
    };


    const handleView = (id) => {
        navigate(`/viewNotes/${id}`);
    };

    const handleDownload = async (fileUrlsString) => {
        const confirmed = await showConfirm("Do you really want to download this Note?");
        if (!confirmed) return;

        try {
            const zip = new JSZip();
            const urls = fileUrlsString.split(',');

            for (const fileUrl of urls) {
                const response = await api.get(fileUrl.trim(), { responseType: 'blob' });
                const fileName = fileUrl.split('/').pop();
                zip.file(fileName, response.data);
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            saveAs(zipBlob, 'NotesBundle.zip');
        } catch (error) {
            console.error("Download error:", error);
            showErrorToast('Could not download the ZIP file.');
        }
    };
    const handleDownloadInvoice = (invoiceData) => {
        const doc = new jsPDF();
        // Add watermark image (semi-transparent) in the center
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Save current graphics state
        doc.saveGraphicsState();

        // Set opacity (transparency)
        doc.setGState(new doc.GState({ opacity: 0.08 })); // Lower opacity for watermark

        // Add watermark image centered
        doc.addImage("Logo.png", "PNG", (pageWidth - 100) / 2, (pageHeight - 100) / 2 + 10, 100, 30);

        // Restore graphics state to normal (no transparency)
        doc.restoreGraphicsState();
        const {
            noteTitle, category, sellPrice, buyerFullName, buyerEmail, buyerAddress,
            sellerFullName, purchaseEmail, sellerAddress, sellerPhone, createdAt, buyerPhone,id,noteId
        } = invoiceData;

        const userId = String(id).padStart(3, '0');
        const UnoteId = String(noteId).padStart(3, '0');
        const emailInitial = (buyerEmail?.charAt(0) || 'X').toUpperCase();
        const invoiceNumber = `NMP-${userId}${UnoteId}${emailInitial}`;

        const invoiceDate = dayjs().format("YYYY-MM-DD");
        

        const price = parseFloat(sellPrice || 0);
        const cgst = (price * 0.09).toFixed(2);
        const sgst = (price * 0.09).toFixed(2);
        const total = (price + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);
        const totalInWords = toWords(Number(total)).toUpperCase();

        // Add Logo
        doc.addImage("Logo.png", "PNG", 15, 10, 50, 15);

        // Invoice details
        doc.setFontSize(11);
        doc.text(`Invoice #: ${invoiceNumber}`, 130, 15);
        doc.text(`Invoice Date: ${invoiceDate}`, 130, 22);
        doc.text(`Purchase Date: ${dayjs(createdAt).format("YYYY-MM-DD")}`, 130, 29);

        // Seller Info
        doc.setFontSize(12);
        doc.text("Seller Information:", 15, 50);
        doc.setFontSize(10);
        doc.text(`Name : ${sellerFullName}`, 15, 56);
        doc.text(`Email : ${purchaseEmail}`, 15, 61);
        doc.text(`Address : ${sellerAddress}`, 15, 66, { maxWidth: 80 });
        doc.text(`Contact : ${sellerPhone}`, 15, 76);

        // Buyer Info
        doc.setFontSize(12);
        doc.text("Buyer Information:", 110, 50);
        doc.setFontSize(10);
        doc.text(`Name : ${buyerFullName}`, 110, 56);
        doc.text(`Email : ${buyerEmail}`, 110, 61);
        doc.text(`Address : ${buyerAddress}`, 110, 66, { maxWidth: 80 });
        doc.text(`Contact No. : ${buyerPhone}`, 110, 76);

        doc.setDrawColor(100);
        doc.line(15, 87, 195, 87);

        // Note details table
        autoTable(doc, {
            startY: 90,
            head: [["Note Title", "Category", "Price"]],
            body: [[noteTitle, category, `$${price.toFixed(2)}`]],
            headStyles: {
                fillColor: [115, 77, 196],
                textColor: 255,
                fontStyle: 'bold',
            },
            styles: { halign: 'center' },
        });

        // Tax table
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 40,
            head: [["Tax Type", "Amount"]],
            body: [
                ["Subtotal", `$${price.toFixed(2)}`],
                ["CGST (9%)", `$${cgst}`],
                ["SGST (9%)", `$${sgst}`],
                ["Total", `$${total}`],
            ],
            styles: { fontSize: 10 },
            headStyles: {
                fillColor: [115, 77, 196],
                textColor: 255,
                halign: 'left',
            },
            columnStyles: {
                halign: 'left'
            },
            didParseCell: (data) => {
                if (data.row.index === 3) data.cell.styles.fontStyle = 'bold';
            },
            tableWidth: 70,
            margin: { left: 130 },
        });

        let yPos = doc.lastAutoTable.finalY + 10;

        // Amount in words
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Reset to black
        doc.text(`Amount in Words: ${totalInWords} DOLLARS ONLY`, 15, yPos);
        yPos += 5;

        // PAID in green
        doc.setFontSize(12);
        doc.setTextColor(0, 128, 0); // Green color
        doc.text("PAID", 160, yPos, { align: "right" });

        doc.addImage("Stam.jpeg", "JPEG", 20, yPos, 30, 28); // Adjust dimensions as needed

        yPos += 30; // Push line down after image height

        // Signature Line and Text
        doc.setDrawColor(0);
        doc.setTextColor(0, 0, 0);
        doc.line(15, yPos, 60, yPos); // Signature line
        doc.text("Authorized Signature", 15, yPos + 5);

        yPos += 15;

        // Terms and Conditions box
        doc.setDrawColor(0);
        doc.setFillColor(245, 245, 245);
        doc.rect(15, yPos, 180, 35, 'FD'); // filled box
        doc.setFontSize(9);
        doc.setTextColor(80);
        doc.text("Terms & Conditions:", 17, yPos + 6);
        doc.setFontSize(8);
        const terms = [
            "1. Notes purchased are for personal use only.",
            "2. No part of the content may be redistributed or sold.",
            "3. Refunds are not applicable post-download.",
            "4. Contact support for technical issues.",
            "5. Prices are subject to change without notice."
        ];
        terms.forEach((term, i) => {
            doc.text(term, 17, yPos + 12 + i * 5);
        });

        yPos += 45;

        // Footer
        doc.setDrawColor(150);
        doc.line(15, yPos, 195, yPos);
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("Notes Marketplace Pvt. Ltd. | support@notesmarketplace.com | +1 123-456-7890", 105, yPos + 5, { align: "center" });

        // Save
        doc.save(`Invoice_${invoiceNumber}.pdf`);
    };

    const handleAddReview = (id) => {
        setReviewNoteId(id);
        setShowModal(true);
    };

    const closeReviewModal = () => {
        setShowModal(false);
        setComment('');
        setRating([false, false, false, false, false]);
        setReviewNoteId(null);
    };

    const handleSubmitReview = async (id, rating, comment) => {
        try {
            const downloadNote = data.find(item => item.id === id);

            if (!downloadNote) {
                showAlert("Download note not found.", "error");
                return;
            }

            const response = await api.put(`/downloadNote/${downloadNote.id}`, {
                email: downloadNote.email,
                noteId: downloadNote.noteId,
                noteTitle: downloadNote.noteTitle,
                category: downloadNote.category,
                sellFor: downloadNote.sellFor,
                sellPrice: downloadNote.sellPrice,
                purchaseEmail: downloadNote.purchaseEmail,
                buyerEmail: downloadNote.buyerEmail,
                approveFlag: downloadNote.approveFlag,
                rating: rating,
                comment: comment,
            });

            if (response.status === 200) {
                showSuccessToast('Review added successfully');
                closeReviewModal();
                fetchData();
            } else {
                showErrorToast('Failed to add Review. Please try again.');
            }
        } catch (error) {
            console.error('Error adding review:', error);
            showErrorToast('Failed to add Review. Please try again.');
        }
    };

    const handleAddReport = (id, noteTitle) => {
        setReportNoteId(id);
        setReportNoteTitle(noteTitle);
        setShowReportModal(true);
    };

    const closeReportModal = () => {
        setShowReportModal(false);
        setReportRemark('');
        setReportNoteId(null);
        setReportNoteTitle('');
    };


    const handleSubmitReport = async (id, ReportRemark) => {
        try {
            const downloadNote = data.find(item => item.id === id);

            if (!downloadNote) {
                showAlert("Download note not found.", "error");
                return;
            }

            const response = await api.put(`/downloadNote/${downloadNote.id}`, {
                email: downloadNote.email,
                noteId: downloadNote.noteId,
                noteTitle: downloadNote.noteTitle,
                category: downloadNote.category,
                sellFor: downloadNote.sellFor,
                sellPrice: downloadNote.sellPrice,
                purchaseEmail: downloadNote.purchaseEmail,
                buyerEmail: downloadNote.buyerEmail,
                approveFlag: downloadNote.approveFlag,
                rating: downloadNote.rating,
                comment: downloadNote.comment,
                ReportRemark: ReportRemark,
            });

            if (response.status === 200) {
                showSuccessToast('Report submitted successfully!');
                closeReportModal();
                fetchData();
            } else {
                showErrorToast('Failed to submit report.');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            showErrorToast('Error submitting report. Please try again.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const result = data.filter(item => {
            const titleMatch = item.noteTitle.toLowerCase().includes(search.toLowerCase());
            const categoryMatch = item.category.toLowerCase().includes(search.toLowerCase());
            const sellTypeMatch = item.sellFor.toLowerCase().includes(search.toLowerCase());
            const priceMatch = item.sellPrice.toString().includes(search.toLowerCase());
            return titleMatch || categoryMatch || sellTypeMatch || priceMatch;
        });
        setFilter(result);
    }, [data, search]);

    return (
        <div style={{ paddingTop: '100px' }}>
            <div className='container d-flex justify-content-center'>
                <div className='row'>
                    <div className='col-md-12'>
                        <DataTable
                            className="datatable-border"
                            columns={columns}
                            data={filter}
                            pagination
                            paginationPerPage={5}
                            fixedHeader
                            selectableRowsHighlight
                            highlightOnHover
                            subHeader
                            subHeaderComponent={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <h1 style={{ marginRight: '450px', color: '#734dc4', fontSize: '20px' }}>My Downloads</h1>
                                    <input type='text' className='w-25 form-control' placeholder='search..' value={search} onChange={(e) => setSearch(e.target.value)} />
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h4>Add Review</h4>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (comment.trim() === '') return;
                            handleSubmitReview(reviewNoteId, rating.filter(Boolean).length, comment);
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                                {rating.map((filled, index) => (
                                    <img
                                        key={index}
                                        src={filled ? 'star.png' : 'star-white.png'}
                                        alt="Star"
                                        style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                                        onClick={() => {
                                            const newRating = rating.map((_, i) => i <= index);
                                            setRating(newRating);
                                        }}
                                    />
                                ))}
                            </div>
                            <label>Comments<span className="required">*</span></label>
                            <textarea className="form-control" placeholder="Write your comment..." maxLength="40" value={comment} onChange={(e) => setComment(e.target.value)} required />
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-success" style={{ backgroundColor: '#734dc4', color: 'white' }}>Submit</button>
                                <button type="button" onClick={() => { closeReviewModal(); }} className="btn btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showReportModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h4>Report as Inappropriate</h4>
                        <p>Note Title: {reportNoteTitle}</p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (ReportRemark.trim() === '') return;
                            handleSubmitReport(reportNoteId, ReportRemark);
                        }}>
                            <label>Report Remark<span className="required">*</span></label>
                            <textarea className="form-control" placeholder="Write your report remark..." value={ReportRemark} onChange={(e) => setReportRemark(e.target.value)} maxLength={60} required />
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-danger" style={{ backgroundColor: '#734dc4', color: 'white' }}>Submit</button>
                                <button type="button" onClick={() => { closeReportModal(); }} className="btn btn-secondary">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default MyDownload;