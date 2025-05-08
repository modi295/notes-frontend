import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../css/grid.css'
import { useNavigate } from 'react-router-dom';
import api from '../Services/api';
import { getUserEmail } from '../Services/auth';
import { showErrorToast } from '../Utility/ToastUtility'; 

function BuyRequest() {
    const navigate = useNavigate();
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
            selector: (row) => row.email,
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

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                    <img
                        src="eye.png"
                        alt="Edit"
                        title="View"
                        onClick={() => handleView(row.noteId)}
                        style={{ cursor: 'pointer', marginRight: '9px' }}
                    />
                </div>

            ),
            width: '120px'
        },
        {
            name: "ACTION",
            cell: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                    <img
                        src="dots.png"
                        alt="Submit"
                        title={row.approveFlag === 'A' ? 'Already Approved' : 'Approve'}
                        onClick={() => row.approveFlag !== 'A' && SubmitData(row)}
                        style={{
                            cursor: row.approveFlag === 'A' ? 'not-allowed' : 'pointer',
                            marginRight: '9px',
                            opacity: row.approveFlag === 'A' ? 0.5 : 1
                        }}
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
          const email = getUserEmail();
          const url = `/buyernotes/${email}`;
          const response = await api.get(url);
          const res = response.data;
      
          if (Array.isArray(res)) {
            setData(res);
            setFilter(res);
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
      

    const postDownloadNote = async (note) => {
        try {
            const email = getUserEmail();

            const data = {
                email,
                noteId: note.noteId,
                noteTitle: note.noteTitle,
                category: note.category,
                sellFor: note.sellFor,
                sellPrice: note.sellPrice,
                purchaseEmail: email,
                buyerEmail: note.email
            };

            if (note.sellPrice > 0) {
                data.PurchaseTypeFlag = 'P';
            }

            console.log("Download Note Data: ", data); // Log the data being sent

            await api.post('/downloadnotes', data);
        } catch (error) {
            console.error(error);
            showErrorToast('An error occurred while processing your request.');
        }
    };

    const postSoldNote = async (note) => {
        try {
            const email = getUserEmail();
            const data = {
                email,
                noteId: note.noteId,
                noteTitle: note.noteTitle,
                category: note.category,
                sellFor: note.sellFor,
                sellPrice: note.sellPrice,
                purchaseEmail: email,
                buyerEmail: note.email
            };

            console.log("Sold Note Data: ", data); // Log the data being sent

            await api.post('/soldnotes', data);
        } catch (error) {
            console.error(error);
            showErrorToast('An error occurred while processing your request.');
        }
    };

    const UpdateBuyerNote = async (note) => {
        try {
            const updatedData = {
                ...note,
                approveFlag: 'A',
            };

            const response = await api.put(`/buyernotes/${note.id}`, updatedData);

            console.log('Buyer note updated:', response.data);
        } catch (error) {
            console.error('Error updating buyer note:', error);
            showErrorToast('Failed to update the buyer note.');
        }
    };

    const SubmitData = (note) => {
        postDownloadNote(note);
        postSoldNote(note);
        UpdateBuyerNote(note);
        window.location.reload();
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
                                    <h1 style={{ marginRight: '450px', color: '#734dc4', fontSize: '20px' }}>Buyer Request</h1>
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

export default BuyRequest;
