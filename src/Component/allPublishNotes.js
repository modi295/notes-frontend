import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../css/grid.css'
import { useNavigate } from 'react-router-dom';

function AllPublishNotes() {
    const navigate = useNavigate();
    const [selectedPublisher, setSelectedPublisher] = useState('');
    const [distinctPublishers, setDistinctPublishers] = useState([]);

    const columns = [
        {
            name: "S.NO",
            selector: (row, index) => index + 1,
            width: '80px',
            center: true
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
            name: "PUBLISHER",
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
            name: "NUMBER OF DOWNLOADS",
            selector: (row) => row.downloadCount,
            sortable: true,
            width: '130px'
        },
        {
            name: "ACTION",
            cell: (row) => (

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                    <img
                        src="eye.png"
                        alt="Edit"
                        title="View"
                        onClick={() => handleView(row.id)}
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
                        src="eye.png"
                        alt="Edit"
                        title="View"
                        onClick={() => handleView2(row.id)}
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
            const url = `http://localhost:5000/api/allpublishNotes`;
            const req = await fetch(url);
            const res = await req.json();

            if (Array.isArray(res)) {
                setData(res);
                setFilter(res);
                const publishers = [...new Set(res.map(item => item.userFullName))];
                setDistinctPublishers(publishers);
            } else {
                // Handle cases where the response contains a message or is not an array
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
    const handleView2 = (id) => {
        navigate(`/downloadNotes/${id}`);
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
                                            <option value=''>Sellers</option>
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
        </div>
    );
}
export default AllPublishNotes;