import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../css/grid.css'
import '../css/allPublishNotes.css';
import { useNavigate } from 'react-router-dom';

function Member() {
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [EmailId, setEmaild] = useState(null);
    const [remark, setRemark] = useState('');
    const [selectedNote, setSelectedNote] = useState({ firstName: '', lastName: '' });



    const columns = [
        {
            name: "S.NO",
            selector: (row, index) => index + 1,
            width: '80px',
            center: "true"
        },
        {
            name: "FIRST NAME",
            selector: (row) => row.firstName,
            sortable: true,
            width: '110px'
        },
        {
            name: "LAST NAME",
            selector: (row) => row.lastName,
            sortable: true,
            width: '110px'
        },
        {
            name: "EMAIL",
            selector: (row) => row.email,
            sortable: true,
            width: '190px'
        },
        {
            name: "JOINING DATE",
            selector: (row) => {
                const createdAt = new Date(row.createdAt);
                const day = createdAt.getDate().toString().padStart(2, '0');
                const month = (createdAt.getMonth() + 1).toString().padStart(2, '0');
                const year = createdAt.getFullYear();
                return `${day}-${month}-${year}`;
            },
            sortable: true,
            width: '130px'
        },
        {
            name: "UNDER REVIEW NOTES",
            selector: (row) => (
                <span
                    style={{ color: '#734dc4', cursor: 'pointer' }}
                    onClick={() => handleView2(row.email)}
                >
                    {row.underReview}
                </span>
            ),
            sortable: true,
            width: '130px'
        },
        {
            name: "PUBLISHED NOTES",
            selector: (row) => (
                <span
                    style={{ color: '#734dc4', cursor: 'pointer' }}
                    onClick={() => handleView3(row.email)}
                >
                    {row.publishNote}
                </span>
            ),
            sortable: true,
            width: '130px'
        },
        {
            name: "DOWNLOADED NOTES",
            selector: (row) => (
                <span
                    style={{ color: '#734dc4', cursor: 'pointer' }}
                    onClick={() => handleView4(row.email)}
                >
                    {row.downloadCount}
                </span>
            ),
            sortable: true,
            width: '130px'
        },
        {
            name: "PRICE",
            selector: (row) => `$${row.totalSellPrice}`,
            sortable: true,
            width: '130px'
        },
        {
            name: "ACTION",
            cell: (row) => (
                <div
                    style={{ position: 'relative', cursor: 'pointer' }}
                    onMouseEnter={() => setActiveDropdown(row.email)}
                    onMouseLeave={() => setActiveDropdown(null)}
                >
                    <img
                        src="dots.png"
                        style={{ cursor: 'pointer' }}
                        alt='Action'
                    />
                    {activeDropdown === row.email && (
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
                                    onClick={() => handleView(row.email)}
                                >
                                    View Details
                                </li>
                                <li
                                    style={{ padding: '10px', cursor: 'pointer' }}
                                    onClick={() => openUnpublishModal(row.email, row.firstName, row.lastName)}
                                >
                                    Deactivate
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
            const req = await fetch(`http://localhost:5000/api/users`);
            const res = await req.json();
            if (Array.isArray(res)) {
                setData(res);
                setFilter(res);
            } else {
                setData([]);
                setFilter([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
            setFilter([]);
        }
    };


    const handleView = (email) => {
        navigate(`/memberDetail/${email}`);
    };
    const handleView2 = (email) => {
        navigate(`/underReview/${email}`);
    };
    const handleView3 = (email) => {
        navigate(`/publishNotes/${email}`);
    };
    const handleView4 = (email) => {
        navigate(`/downloadNotes/${email}`);
    };
    const openUnpublishModal = (email, firstName, lastName) => {
        setEmaild(email);
        setSelectedNote({ firstName, lastName });
        setShowModal(true);
    };

    const closeUnpublishModal = () => {
        setShowModal(false);
        setRemark('');
        setEmaild(null);
    };


    const updateUserStatus = async () => {
        if (!remark.trim()) {
            alert("Please enter a remark before making user Inactive.");
            return;
        }

        try {
            const userResponse = await fetch(`http://localhost:5000/api/users/${EmailId}`);
            if (!userResponse.ok) throw new Error('Failed to fetch user data');

            const userData = await userResponse.json();

            const updatedUserData = {
                ...userData,
                active: 'N',
                remark: remark.trim()
            };

            const updateResponse = await fetch(`http://localhost:5000/api/users/${EmailId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUserData)
            });

            if (updateResponse.ok) {
                setData(prevData => prevData.map(user =>
                    user.email === EmailId ? { ...user, active: 'N', remark: remark.trim() } : user
                ));
                alert(`User status updated successfully.`);
                closeUnpublishModal();
            } else {
                alert(`Failed to update user status`);
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('Error updating user status.');
        }
    };


    useEffect(() => { fetchData(); }, []);
    useEffect(() => {
        const result = data.filter(item =>
            item.firstName.toLowerCase().includes(search.toLowerCase()) ||
            item.lastName.toLowerCase().includes(search.toLowerCase()) ||
            item.email.toLowerCase().includes(search.toLowerCase())
        );
        setFilter(result);
    }, [data, search]);



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
                                <input
                                    type='text'
                                    className='form-control'
                                    style={{ width: '200px' }}
                                    placeholder='Search...'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            }
                        />
                    </div>
                </div>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h4>{selectedNote.firstName} - {selectedNote.lastName}</h4>
                        <label>Remarks</label>
                        <textarea
                            className="form-control"
                            placeholder="Write remarks..."
                            maxLength="200"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                        />
                        <div className="modal-footer">
                            <button onClick={updateUserStatus} className="btn btn-danger">Deactivate</button>
                            <button onClick={closeUnpublishModal} className="btn btn-secondary">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Member;