import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../css/grid.css'
import { useNavigate } from 'react-router-dom';
import api from '../Services/api';
import { ToastContainer } from 'react-toastify';
import { showConfirm } from '../Utility/ConfirmBox'; 
import { showSuccessToast, showErrorToast } from '../Utility/ToastUtility';

function SpamReport() {
    const navigate = useNavigate();
    const columns = [
        {
            name: "SR NO.",
            selector: (row, index) => index + 1,
            sortable: false,
            width: '100px'
        },
        {
            name: "Reproted By",
            selector: (row) => row.buyerName,
            sortable: true,
            width: '160px'
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
            width: '160px'
        },
        {
            name: "CATAGORY",
            selector: (row) => row.category,
            sortable: true,
            width: '130px'
        },
        {
            name: "DATE EDITED",
            selector: (row) => {
                const createdAt = new Date(row.updatedAt);
                const day = createdAt.getDate().toString().padStart(2, '0');
                const month = (createdAt.getMonth() + 1).toString().padStart(2, '0');
                const year = createdAt.getFullYear();
                const hours = createdAt.getHours().toString().padStart(2, '0');
                const minutes = createdAt.getMinutes().toString().padStart(2, '0');
                return `${day}-${month}-${year} ${hours}:${minutes}`;
            },
            sortable: true,
            width: '160px'
        },
        {
            name: "REMARK",
            selector: (row) => row.ReportRemark,
            sortable: true,
            width: '210px'
        },
        {
            name: "ACTION",
            cell: (row) => (

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                    <img
                        src="delete.png"
                        alt="Delete"
                        title="Delete"
                        onClick={() => handleDeleteReview(row.id)}
                        style={{ cursor: 'pointer', marginRight: '9px' }}
                    />
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
            const response = await api.get('/reportednotes');
    
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
    
    const handleDeleteReview = async (downloadNoteId) => {
        const confirmed = await showConfirm("Do you really want to delete this report?");
        if (!confirmed) return;
            try {
                const response = await api.put(`/downloadNote/${downloadNoteId}`, {
                    ReportRemark: null,
                });
    
                if (response.data.success) {
                    showSuccessToast('Report deleted successfully');
                    fetchData();
                } else {
                    showErrorToast('Failed to delete Report.');

                    console.error('Failed to delete Report:', response.data.message);
                }
            } catch (error) {
                console.error('Error deleting Report:', error);
                showErrorToast('An error occurred while deleting the Report.');
            }
        
    };

    const handleView = (id) => {
        navigate(`/viewNotes/${id}`);
    };
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const result = data.filter(item => {
            const titleMatch = item.noteTitle.toLowerCase().includes(search.toLowerCase());
            const categoryMatch = item.category.toLowerCase().includes(search.toLowerCase());
            const ReportRemarkMatch = item.ReportRemark.toLowerCase().includes(search.toLowerCase());
            const buyerNameMatch = item.buyerName.toString().includes(search.toLowerCase()); // Assuming price is a string
            return titleMatch || categoryMatch || ReportRemarkMatch || buyerNameMatch;
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
                                    <h1 style={{ marginRight: '450px', color: '#734dc4', fontSize: '20px' }}>Spam Reports</h1>
                                    <input type='text' className='w-25 form-control' placeholder='search..' value={search} onChange={(e) => setSearch(e.target.value)} />
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default SpamReport;
