import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../css/grid.css'
import '../css/allPublishNotes.css';
import { useNavigate } from 'react-router-dom';

function RejectedNotes() {
    const navigate = useNavigate();
    const [selectedPublisher, setSelectedPublisher] = useState('');
    const [distinctPublishers, setDistinctPublishers] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [unpublishId, setUnpublishId] = useState(null);
    const [remark, setRemark] = useState('');
    const [selectedNote, setSelectedNote] = useState({ title: '', category: '' });


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
            width: '190px'
        },
        {
            name: "PUBLISHER",
            selector: (row) => row.userFullName,
            sortable: true,
            width: '130px'
        },
        {
            name: "DATE Edited",
            selector: (row) => {
                const createdAt = new Date(row.updatedAt);
                const day = createdAt.getDate().toString().padStart(2, '0');
                const month = (createdAt.getMonth() + 1).toString().padStart(2, '0');
                const year = createdAt.getFullYear();
                return `${day}-${month}-${year}`;
            },
            sortable: true,
            width: '190px'
        },
        {
            name: "Remark",
            selector: (row) => row.remark,
            sortable: true,
            width: '130px'
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
                                <li
                                    style={{ padding: '10px', cursor: 'pointer' }}
                                    onClick={() => openUnpublishModal(row.id, row.noteTitle, row.category)}
                                >
                                    Approve
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            ),
            width: '120px'
        }

    ];

    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState([]);

    const fetchData = async () => {
        try {
            const url = `http://localhost:5000/api/rejectedNotes`;
            const req = await fetch(url);
            const res = await req.json();

            if (Array.isArray(res)) {
                setData(res);
                setFilter(res);
                const publishers = [...new Set(res.map(item => item.userFullName))];
                setDistinctPublishers(publishers);
            } else {
                setData([]);
                setFilter([]);
                console.warn('No data available:', res.message || 'Unexpected response format');
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
    const handleDownload = (filePath) => {
        if (!filePath) {
            alert("No attachment available for download");
            return;
        }
        const link = document.createElement("a");
        link.href = filePath;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

    const updateStatus = async () => {
        if (!remark.trim()) {
            alert("Please enter a remark before Approve.");
            return;
        }

        try {
            const noteResponse = await fetch(`http://localhost:5000/api/notesById/${unpublishId}`);
            if (!noteResponse.ok) throw new Error('Failed to fetch the note data');

            const noteData = await noteResponse.json();
            const updatedNoteData = {
                ...noteData,
                publishFlag: 'P',
                remark: remark.trim()
            };

            const updateResponse = await fetch(`http://localhost:5000/api/updateNotesStatus/${unpublishId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedNoteData)
            });

            if (updateResponse.ok) {
                setData(prevData => prevData.map(note =>
                    note.id === unpublishId ? { ...note, publishFlag: 'P', remark: remark.trim() } : note
                ));
                alert(`Note Approve successfully.`);
                closeUnpublishModal();
            } else {
                alert(`Failed to update status`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status.');
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
            const publisherMatch = selectedPublisher ? item.userFullName === selectedPublisher : true;

            return (titleMatch || categoryMatch || sellTypeMatch || priceMatch) && publisherMatch;
        });
        setFilter(result);
    }, [data, search, selectedPublisher]);



    return (
        <div style={{ paddingTop: '10px' }}>
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
                                            <option value=''>Sellers ▼</option>
                                            {distinctPublishers.map((publisher, index) => (
                                                <option key={index} value={publisher}>{publisher}</option>
                                            ))}
                                        </select>
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
                            <button onClick={updateStatus} className="btn btn-success">Approve</button>
                            <button onClick={closeUnpublishModal} className="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default RejectedNotes;