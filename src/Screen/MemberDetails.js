import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import '../css/grid.css';
import '../css/allPublishNotes.css';
import api from '../Services/api';


function MemberDetails() {
    const { email } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [downloadData, setDownloadData] = useState([]);
    const [downloadFilter, setDownloadFilter] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [downloadSearch, setDownloadSearch] = useState('');

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${email}`);
                setUser(response.data);
                if (response.data.profilePicture && response.data.profilePicture.data) {
                    const imageData = new Uint8Array(response.data.profilePicture.data);
                    const base64Image = arrayBufferToBase64(imageData);
                    setProfilePicture(`data:image/png;base64,${base64Image}`);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        const fetchDownloadData = async () => {
            try {
                const url = `http://localhost:5000/api/getUserNotesByEmail/${email}`;
                const req = await fetch(url);
                const res = await req.json();

                if (res.message) {
                    setDownloadData([]);
                    setDownloadFilter([]);
                } else {
                    setDownloadData(res);
                    setDownloadFilter(res);
                }
            } catch (error) {
                console.error('Error fetching download data:', error);
                setDownloadData([]);
                setDownloadFilter([]);
            }
        };

        fetchUser();
        fetchDownloadData();
    }, [email]);

    useEffect(() => {
        const result = downloadData.filter(item => {
            const titleMatch = item.noteTitle.toLowerCase().includes(downloadSearch.toLowerCase());
            const categoryMatch = item.category.toLowerCase().includes(downloadSearch.toLowerCase());
            const sellTypeMatch = item.sellFor.toLowerCase().includes(downloadSearch.toLowerCase());
            const priceMatch = item.sellPrice.toString().includes(downloadSearch.toLowerCase());
            return titleMatch || categoryMatch || sellTypeMatch || priceMatch;
        });
        setDownloadFilter(result);
    }, [downloadData, downloadSearch]);

    const handleView = (id) => {
        navigate(`/viewNotes/${id}`);
    };
    const handleView2 = (id) => {
        navigate(`/downloadNotes/${id}`);
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

    const downloadColumns = [
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
                    onClick={() => handleView(row.id)}
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
            width: '130px'
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
            width: '190px'
        },
        {
            name: "NUMBER OF DOWNLOADS",
            selector: (row) => (
                <span
                    style={{ color: '#734dc4', cursor: 'pointer' }}
                    onClick={() => handleView2(row.id)}
                >
                    {row.downloadCount}
                </span>
            ),
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
            name: "DATE ADDED",
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
            name: "PUBLISH DATE",
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
            name: "ACTION",
            cell: (row) => (
                <div
                    style={{ position: 'relative', cursor: 'pointer' }}
                    onMouseEnter={() => setActiveDropdown(row.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                >
                    <img
                        src="dots.png"
                        style={{ cursor: 'pointer' }}
                        alt="Actions Menu"

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
                            </ul>
                        </div>
                    )}
                </div>
            ),
            width: '120px'
        }

    ];

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="container mt-5">
                <div className="p-4"> {/* Removed 'card' class */}
                    <h2 className="mb-4" style={{ color: '#734dc4' }}>Member Details</h2>
                    <div className="d-flex">
                        <img
                            src={profilePicture}
                            alt="Profile"
                            className="rounded-circle me-3"
                            style={{ width: '150px', height: '150px', objectFit: 'cover', marginRight: '20px' }}
                        />
                        <div className="w-100">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col-4 mb-2" style={{ paddingRight: '5px' }}><span>First Name:</span></div>
                                        <div className="col-8 mb-2"><span style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{user.firstName}</span></div>
                                        <div className="col-4 mb-2" style={{ paddingRight: '5px' }}><span>Last Name:</span></div>
                                        <div className="col-8 mb-2"><span style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{user.lastName}</span></div>
                                        <div className="col-4 mb-2" style={{ paddingRight: '5px' }}><span>Email:</span></div>
                                        <div className="col-8 mb-2"><span style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{user.email}</span></div>
                                        <div className="col-4 mb-2" style={{ paddingRight: '5px' }}><span>DOB:</span></div>
                                        <div className="col-8 mb-2"><span style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{formatDate(user.dob)}</span></div>
                                        <div className="col-4 mb-2" style={{ paddingRight: '5px' }}><span>Phone Number:</span></div>
                                        <div className="col-8 mb-2"><span style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{user.phoneNumber}</span></div>
                                        <div className="col-4 mb-2" style={{ paddingRight: '5px' }}><span>College/University:</span></div>
                                        <div className="col-8 mb-2"><span style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{user.university}</span></div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col-4 mb-2" style={{ paddingRight: '5px' }}><span>Address 1:</span></div>
                                        <div className="col-8 mb-2"><span style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{user.address1}</span></div>
                                        <div className="col-4 mb-2" style={{ paddingRight: '5px' }}><span>Address 2:</span></div>
                                        <div className="col-8 mb-2"><span style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{user.address2}</span></div>
                                        <div className="col-4 mb-2" style={{ paddingRight: '5px' }}><span>City:</span></div>
                                        <div className="col-8 mb-2"><span style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{user.city}</span></div>
                                        <div className="col-4 mb-2" style={{ paddingRight: '5px' }}><span>State:</span></div>
                                        <div className="col-8 mb-2"><span style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{user.state}</span></div>
                                        <div className="col-4 mb-2" style={{ paddingRight: '5px' }}><span>Country:</span></div>
                                        <div className="col-8 mb-2"><span style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{user.country}</span></div>
                                        <div className="col-4 mb-2" style={{ paddingRight: '5px' }}><span>Zip Code:</span></div>
                                        <div className="col-8 mb-2"><span style={{ color: '#734dc4', fontSize: '15px', fontWeight: 500 }}>{user.zipCode}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="my-4" />
                </div>
            </div>
            <div style={{ paddingTop: '10px' }}>
                <div className='container d-flex justify-content-center'>
                    <div className='row'>
                        <div className='col-md-12'>
                            <DataTable
                                className="datatable-border"
                                columns={downloadColumns}
                                data={downloadFilter}
                                pagination
                                paginationPerPage={5}
                                // selectableRows
                                fixedHeader
                                selectableRowsHighlight
                                highlightOnHover
                                subHeader
                                subHeaderComponent={
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <h1 style={{ marginRight: '450px', color: '#734dc4', fontSize: '20px' }}>Notes</h1>
                                        <input type='text' className='w-25 form-control' placeholder='search..' value={downloadSearch} onChange={(e) => setDownloadSearch(e.target.value)} />
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MemberDetails;