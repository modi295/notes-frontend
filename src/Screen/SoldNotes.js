import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../css/grid.css'
import { useNavigate } from 'react-router-dom';
import { getUserEmail } from '../Services/auth';
import api from '../Services/api';


function SoldNotes() {
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
        }
    ];

    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState([]);

    const fetchData = async () => {
        try {
            const email = getUserEmail();
            const response = await api.get(`/soldnotes/${email}`);
    
            if (Array.isArray(response.data)) {
                setData(response.data);
                setFilter(response.data);
            } else {
                // Handle cases where the response contains a message instead of an array
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
    

    const handleView = (id) => {
        navigate(`/viewNotes/${id}`);
    };
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const result = data.filter(item => {
            const titleMatch = item.noteTitle.toLowerCase().includes(search.toLowerCase());
            const buyerEmail = item.buyerEmail.toLowerCase().includes(search.toLowerCase());
            const categoryMatch = item.category.toLowerCase().includes(search.toLowerCase());
            const sellTypeMatch = item.sellFor.toLowerCase().includes(search.toLowerCase());
            const priceMatch = item.sellPrice.toString().includes(search.toLowerCase()); // Assuming price is a string
            return titleMatch || categoryMatch || sellTypeMatch || priceMatch||buyerEmail;
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
                                    <h1 style={{ marginRight: '450px', color: '#734dc4', fontSize: '20px' }}>My Sold Notes</h1>
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

export default SoldNotes;
