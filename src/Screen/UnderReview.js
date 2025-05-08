import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../css/grid.css'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../Services/api';
import { showAlert, showConfirm } from '../Utility/ConfirmBox'; 
import { ToastContainer } from 'react-toastify';
import { showSuccessToast, showErrorToast } from '../Utility/ToastUtility';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function UnderReview() {
    const navigate = useNavigate();
    const [selectedPublisher, setSelectedPublisher] = useState('');
    const [distinctPublishers, setDistinctPublishers] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [unpublishId, setUnpublishId] = useState(null);
    const [remark, setRemark] = useState('');
    const [selectedNote, setSelectedNote] = useState({ title: '', category: '' });
    const { email } = useParams();

    const columns = [
        {
            name: "S.NO",
            selector: (row, index) => index + 1,
            width: '80px',
            center: "true"
        },
        {
            name: "TITLE",
            selector: (row) => (
                <span
                    style={{ color: '#734dc4', cursor: 'pointer' }}
                    onClick={() => handleView(row.id)}
                >
                    {row.noteTitle}
                </span>
            ),
            sortable: true,
            width: '190px'
        },
        {
            name: "CATEGORY",
            selector: (row) => row.category,
            sortable: true,
            width: '130px'
        },
        {
            name: "SELLER",
            selector: (row) => row.userFullName,
            sortable: true,
            width: '130px'
        },
        {
            name: "CREATED DATE",
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
            name: "STATUS",
            selector: (row) => {
                switch (row.publishFlag) {
                    case 'N':
                        return "Submitted for Review";
                    case 'I':
                        return "In Review";
                    case 'P':
                        return "Approved";
                    case 'R':
                        return "Rejected";
                    case 'U':
                        return "Unpublish";
                    default:
                        return "Unknown";
                }
            },
            sortable: true,
            width: '210px'
        },
        {
            name: "ACTION",
            cell: (row) => (
                <div style={{ display: 'flex', gap: '5px' }}>
                    <button style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '5px', cursor: 'pointer' }} onClick={() => updateStatus(row.id, 'P')}>Approve</button>
                    <button style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px', cursor: 'pointer' }} onClick={() => openUnpublishModal(row.id, row.noteTitle, row.category)}>Reject</button>
                    <button style={{ backgroundColor: 'gray', color: 'white', border: 'none', padding: '5px', cursor: 'pointer' }} onClick={() => updateStatus(row.id, 'I')}>In Review</button>
                </div>
            ),
            width: '250px'
        },
        {
            name: "",
            cell: (row) => (
                <div
                    style={{ position: 'relative', cursor: 'pointer' }}
                    onMouseEnter={() => setActiveDropdown(row.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                >
                    <img
                        src="/dots.png"
                        alt="More"
                        title="More Actions"
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
                            width: '150px',
                            zIndex: 10
                        }}>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                <li
                                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #ddd' }}
                                    onClick={() => handleDownload(row.notesAttachmentP)}
                                >
                                    Download Notes
                                </li>
                                <li
                                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #ddd' }}
                                    onClick={() => handleView(row.id)}
                                >
                                    View Details
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            ),
            width: '30px'
        }
    ];

    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState([]);

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
    
    

    const updateStatus = async (id, status) => {
        const getStatusMessage = (status) => {
            switch (status) {
                case 'N':
                    return "Submitted for Review";
                case 'I':
                    return "In Review";
                case 'P':
                    return "Approved";
                case 'R':
                    return "Rejected";
                case 'U':
                    return "Unpublish";
                default:
                    return "Unknown";
            }
        };
    
        const confirmed = await showConfirm(`Are you sure you want to change the status to ${getStatusMessage(status)}?`);
        if (!confirmed) return;
    
        try {
            const noteResponse = await api.get(`/notesById/${id}`);
            
            if (noteResponse.status !== 200) {
                throw new Error('Failed to fetch the note data');
            }
    
            const noteData = noteResponse.data;
            const updatedNoteData = {
                ...noteData,
                publishFlag: status
            };
    
            console.log(updatedNoteData);
    
            const updateResponse = await api.put(`/updateNotesStatus/${id}`, updatedNoteData);
    
            if (updateResponse.status === 200) {
                setData(prevData => prevData.map(note =>
                    note.id === id ? { ...note, publishFlag: status } : note
                ));
                showSuccessToast(`Status updated to ${status}`);
            } else {
                showErrorToast("Failed to update status.");
            }
    
        } catch (error) {
            console.error('Error updating status:', error);
            showErrorToast("Error updating status.");
        }
    };
    
    
    const openUnpublishModal = (id, title, category) => {
        setUnpublishId(id);
        setSelectedNote({ title, category });
        setShowModal(true);
    };

    const closeUnpublishModal = () => {
        setShowModal(false);
        setRemark('');
        setUnpublishId(null);
    };
    const updateStatusR = async () => {
        if (!remark.trim()) {
            showAlert("Please enter a remark before rejecting.", "info");
            return;
        }
    
        try {
            const noteResponse = await api.get(`/notesById/${unpublishId}`);
    
            if (noteResponse.status !== 200) {
                throw new Error('Failed to fetch the note data');
            }
    
            const noteData = noteResponse.data;
            const updatedNoteData = {
                ...noteData,
                publishFlag: 'R',
                remark: remark.trim()
            };
    
            const updateResponse = await api.put(`/updateNotesStatus/${unpublishId}`, updatedNoteData);
    
            if (updateResponse.status === 200) {
                setData(prevData => prevData.map(note =>
                    note.id === unpublishId ? { ...note, publishFlag: 'R', remark: remark.trim() } : note
                ));
                showSuccessToast("Note rejected successfully.");
                closeUnpublishModal();
            } else {
                showErrorToast("Failed to update status.");
            }
    
        } catch (error) {
            console.error('Error updating status:', error);
            showErrorToast("Error updating status.");
        }
    };
    

   
    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = '/underReviewNotes'; // Simplified URL as the base URL is already included in api.js

                if (email && email.includes("@")) {
                    url = `/underReviewNotes/${email}`;
                }

                const response = await api.get(url);

                if (Array.isArray(response.data)) {
                    setData(response.data);
                    setFilter(response.data);
                    const publishers = [...new Set(response.data.map(item => item.userFullName))];
                    setDistinctPublishers(publishers);
                } else {
                    setData([]);
                    setFilter([]);
                    console.warn('No data available:', response.data.message || 'Unexpected response format');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setData([]);
                setFilter([]);
            }
        };

        fetchData();
    }, [email]);

    useEffect(() => {
        const result = data.filter(item => {
            const titleMatch = item.noteTitle.toLowerCase().includes(search.toLowerCase());
            const categoryMatch = item.category.toLowerCase().includes(search.toLowerCase());
            const sellTypeMatch = item.sellFor.toLowerCase().includes(search.toLowerCase());
            const priceMatch = item.sellPrice.toString().includes(search.toLowerCase());
            const publisherMatch = selectedPublisher ? item.userFullName === selectedPublisher : true;

            return (titleMatch || categoryMatch || sellTypeMatch || priceMatch) && publisherMatch;
        });
        setFilter(result);
    }, [data, search, selectedPublisher]);



    return (
        <div style={{ paddingTop: '100px' }}>
            <h1 style={{ marginLeft: '161px', marginBottom: '10px', color: '#734dc4', fontSize: '30px' }}>Notes Under Review</h1>
            <div className='container d-flex justify-content-center'>
                <div className='row'>
                    <div className='col-md-12'>
                        <DataTable
                            className="datatable-border"
                            columns={columns}
                            data={filter}
                            pagination
                            paginationPerPage={5}
                            // selectableRows
                            fixedHeader
                            selectableRowsHighlight
                            highlightOnHover
                            subHeader
                            subHeaderComponent={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', width: '100%' }}>
                                    <div className="input-group" style={{ width: '200px' }}>
                                        <select
                                            className='form-control'
                                            value={selectedPublisher}
                                            onChange={(e) => setSelectedPublisher(e.target.value)}
                                            style={{
                                                cursor: 'pointer',
                                                backgroundSize: '10px',
                                            }}
                                        >
                                            <option value=''>Sellers</option>
                                            {distinctPublishers.map((publisher, index) => (
                                                <option key={index} value={publisher}>{publisher}</option>
                                            ))}
                                        </select>
                                        <img src="/arrow-down.png" alt="Arrow Down Icon" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', zIndex: '1' }} />

                                    </div>

                                    <input
                                        type='text'
                                        className='form-control'
                                        style={{ width: '200px' }}
                                        placeholder='Search...'
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h4>{selectedNote.title} - {selectedNote.category}</h4>
                        <label>Remarks</label>
                        <textarea
                            className="form-control"
                            placeholder="Write remarks..."
                            maxLength="200"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                        />
                        <div className="modal-footer">
                            <button onClick={updateStatusR} className="btn btn-danger">Reject</button>
                            <button onClick={closeUnpublishModal} className="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}
export default UnderReview;