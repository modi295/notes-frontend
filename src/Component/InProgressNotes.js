import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../css/grid.css'
import { useNavigate } from 'react-router-dom';
import { getUserEmail } from '../Services/auth';
import api from '../Services/api';

function InProgressNotes() {
    const navigate = useNavigate();
    const columns = [
        {
            name: "ADDED AT",
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
            name: "TITLE",
            selector: (row) => row.noteTitle,
            sortable: true,
            width: '300px'
        },
        {
            name: "CATEGORY",
            selector: (row) => row.category,
            sortable: true,
            width: '190px'
        },
        {
            name: "STATUS",
            selector: (row) => row.statusFlag,
            sortable: true,
            width: '180px'
        },
        {
            name: "Action",
            cell: (row) => (

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                    <img
                        src="edit.png"
                        alt="Edit"
                        onClick={() => handleEdit(row.id)}
                        title="Edit"
                        style={{ cursor: 'pointer', marginRight: '9px' }}
                    />
                    <img
                        src="delete.png"
                        alt="Delete"
                        onClick={() => handleDelete(row.id)}
                        title="Delete"
                        style={{ cursor: 'pointer' }}
                    />
                </div>

            ),
            width: '140px'
        }
    ];

    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState([]);

    const fetchData = async () => {
        try {
          const email = getUserEmail();
          const url = `/saveNotes/${email}`;
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
      

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const result = data.filter(item => {
            const titleMatch = item.noteTitle.toLowerCase().includes(search.toLowerCase());
            const categoryMatch = item.category.toLowerCase().includes(search.toLowerCase());
            const statusMatch = item.statusFlag.toLowerCase().includes(search.toLowerCase());
            return titleMatch || categoryMatch || statusMatch;
        });
        setFilter(result);
    }, [data, search]);

    const handleDelete = async (id) => {
        try {
          await api.delete(`/deleteNote/${id}`);
          
          const updatedData = data.filter(item => item.id !== id);
          setData(updatedData);
          setFilter(updatedData);
        } catch (error) {
          console.error('Error deleting note:', error);
        }
      };
      
    const handleEdit = (id) => {
        navigate(`/editNotes/${id}`);
    };

    return (
        <div style={{ paddingTop: '30px' }}>
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
                                    <h1 style={{ marginRight: '450px', marginBottom: '0', color: '#734dc4', fontSize: '20px' }}>In Progress Notes</h1>
                                    <input type='text' className='w-25 form-control' placeholder='search..' value={search} onChange={(e) => setSearch(e.target.value)} />
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InProgressNotes