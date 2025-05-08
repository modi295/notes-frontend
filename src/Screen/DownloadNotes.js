import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../css/grid.css'
import { useNavigate, useParams } from 'react-router-dom';
import api from '../Services/api';


function DownloadNotes() {
    const navigate = useNavigate();
    const { id } = useParams();
    const columns = [
        { name: "S.NO", selector: (row, index) => index + 1, width: '80px', center: "true" },
        {
            name: "TITLE",
            selector: (row) => (
                <span style={{ color: '#734dc4', cursor: 'pointer' }} onClick={() => handleView(row.noteId)}>
                    {row.noteTitle}
                </span>
            ),
            sortable: true,
            width: '190px'
        },
        { name: "CATEGORY", selector: (row) => row.category, sortable: true, width: '190px' },
        { name: "BUYER", selector: (row) => row.buyerName, sortable: true, width: '130px' },
        { name: "SELLER", selector: (row) => row.purchaserName, sortable: true, width: '130px' },
        { name: "SELL TYPE", selector: (row) => row.sellFor, sortable: true, width: '130px' },
        { name: "PRICE", selector: (row) => `$${row.sellPrice}`, sortable: true, width: '130px' },
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
            name: "ACTION",
            cell: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                    <img src="/eye.png" alt="Edit" title="View" onClick={() => handleView(row.noteId)} style={{ cursor: 'pointer', marginRight: '9px' }} />
                </div>
            ),
            width: '120px'
        }
    ];

    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedSeller, setSelectedSeller] = useState('');
    const [selectedBuyer, setSelectedBuyer] = useState('');
    const [selectedNoteTitle, setSelectedNoteTitle] = useState('');
    const [filter, setFilter] = useState([]);


    const handleView = (noteId) => {
        navigate(`/viewNotes/${noteId}`);
    };

    useEffect(() => {
        const fetchData = async () => { // Moved fetchData inside useEffect
          try {
            let url = `/downloadnotes`;
            if (id) {
              if (id.includes("@")) {
                url = `/downloadnotesbyemail/${id}`;
              } else {
                url = `/downloadnotesbyId/${id}`;
              }
            }
      
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
      
        fetchData();
      }, [id]);
      

    useEffect(() => {
        const result = data.filter(item => {
            const titleMatch = item.noteTitle.toLowerCase().includes(search.toLowerCase());
            const categoryMatch = item.category.toLowerCase().includes(search.toLowerCase());
            const sellTypeMatch = item.sellFor.toLowerCase().includes(search.toLowerCase());
            const priceMatch = item.sellPrice.toString().includes(search.toLowerCase());

            const sellerMatch = selectedSeller === '' || item.purchaserName === selectedSeller;
            const buyerMatch = selectedBuyer === '' || item.buyerName === selectedBuyer;
            const noteTitleMatch = selectedNoteTitle === '' || item.noteTitle === selectedNoteTitle;

            return (titleMatch || categoryMatch || sellTypeMatch || priceMatch) && sellerMatch && buyerMatch && noteTitleMatch;
        });
        setFilter(result);
    }, [data, search, selectedSeller, selectedBuyer, selectedNoteTitle]);

    const distinctSellers = [...new Set(data.map(item => item.purchaserName))];
    const distinctBuyers = [...new Set(data.map(item => item.buyerName))];
    const distinctNoteTitles = [...new Set(data.map(item => item.noteTitle))];

    return (
        <div style={{ paddingTop: '100px' }}>
            <h1 style={{ marginLeft: '115px', color: '#734dc4', fontSize: '30px' }}>Downloaded Notes</h1>
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', width: '100%' }}>
                                    <div className="input-group" style={{ width: '600px', gap: '10px' }}>
                                        <select className='form-control w-25' value={selectedSeller} onChange={(e) => setSelectedSeller(e.target.value)}>
                                            <option value=''>Sellers ▼</option>
                                            {distinctSellers.map((seller, index) => (
                                                <option key={index} value={seller}>{seller}</option>
                                            ))}
                                        </select>
                                        <select className='form-control w-25' value={selectedBuyer} onChange={(e) => setSelectedBuyer(e.target.value)}>
                                            <option value=''>Buyers ▼</option>
                                            {distinctBuyers.map((buyer, index) => (
                                                <option key={index} value={buyer}>{buyer}</option>
                                            ))}
                                        </select>
                                        <select className='form-control w-25' value={selectedNoteTitle} onChange={(e) => setSelectedNoteTitle(e.target.value)}>
                                            <option value=''>Note Titles ▼</option>
                                            {distinctNoteTitles.map((noteTitle, index) => (
                                                <option key={index} value={noteTitle}>{noteTitle}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <input type='text' className='w-25 form-control' placeholder='Search...' value={search} onChange={(e) => setSearch(e.target.value)} />
                                </div>

                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DownloadNotes;
