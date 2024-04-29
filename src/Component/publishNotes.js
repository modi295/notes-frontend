import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../css/grid.css'
import { useNavigate } from 'react-router-dom';

function PublishNotes() {
    const navigate = useNavigate();
    const columns = [
        {
            name: "ADDED AT",
            selector: (row) => {
                const createdAt = new Date(row.createdAt);
                return createdAt.toISOString().split('T')[0]; // Extract date part
            },
            sortable: true,
            width: '150px'
        },
        {
            name: "TITLE",
            selector: (row) => row.noteTitle,
            width: '300px'
        },
        {
            name: "CATEGORY",
            selector: (row) => row.category,
            width: '150px'
        },
        {
            name: "STATUS",
            selector: (row) => row.statusFlag,
            width: '150px'
        },
        {
            name: "Action",
            cell: (row) => (

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                    <img
                        src="edit.png"
                        alt="Edit"
                        onClick={() => handleEdit(row.id)}
                        style={{ cursor: 'pointer', marginRight: '9px' }}
                    />
                    <img
                        src="delete.png"
                        alt="Delete"
                        onClick={() => handleDelete(row.id)}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

            )
        }
    ];

    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState([]);

    const fetchData = async () => {
        try {
            const req = await fetch("http://localhost:5000/api/allNotes");
            const res = await req.json();
            setData(res);
            setFilter(res);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const result = data.filter((item) => {
            return item.noteTitle.toLowerCase().includes(search.toLowerCase());
        });
        setFilter(result);
    }, [data, search]);

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/deleteNote/${id}`, {
                method: 'DELETE'
            });
            // Filter out the deleted note from the data
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
                                <h1 style={{ marginRight: '500px', marginBottom: '0', color: '#734dc4', fontSize: '20px' }}>My publish Notes</h1>
                                <input  type='text' className='w-25 form-control'  placeholder='search..' value={search}  onChange={(e) => setSearch(e.target.value)} />
                            </div>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PublishNotes;
