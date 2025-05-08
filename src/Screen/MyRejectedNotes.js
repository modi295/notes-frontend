import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../css/grid.css'
import { useNavigate } from 'react-router-dom';
import { getUserEmail } from '../Services/auth';
import api from '../Services/api';
import { showConfirm } from '../Utility/ConfirmBox'; 
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { showErrorToast } from '../Utility/ToastUtility';

function MyRejectedNotes() {
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(null);
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
            name: "REMARKS",
            selector: (row) => row.remark,
            sortable: true,
            width: '200px'
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
            const email = getUserEmail();
            const response = await api.get(`/rejectedNotesByEmail/${email}`);
    
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
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const result = data.filter(item => {
            const titleMatch = item.noteTitle.toLowerCase().includes(search.toLowerCase());
            const categoryMatch = item.category.toLowerCase().includes(search.toLowerCase());
            const sellTypeMatch = item.sellFor.toLowerCase().includes(search.toLowerCase());
            const priceMatch = item.sellPrice.toString().includes(search.toLowerCase()); // Assuming price is a string
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
                            // selectableRows
                            fixedHeader
                            selectableRowsHighlight
                            highlightOnHover
                            subHeader
                            subHeaderComponent={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <h1 style={{ marginRight: '400px', color: '#734dc4', fontSize: '20px' }}>My Rejected Notes</h1>
                                    <input type='text' className='w-25 form-control' placeholder='search..' value={search} onChange={(e) => setSearch(e.target.value)} />
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyRejectedNotes;
