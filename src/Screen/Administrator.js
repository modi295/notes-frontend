import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../css/grid.css';
import '../css/allPublishNotes.css';
import { useNavigate, Link } from 'react-router-dom';
import api from '../Services/api';
import { ToastContainer } from 'react-toastify';
import { showSuccessToast, showErrorToast } from '../Utility/ToastUtility';
import { showAlert } from '../Utility/ConfirmBox'; 


function Administrator() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [EmailId, setEmaild] = useState(null);
  const [remark, setRemark] = useState('Deactivated');
  const [selectedNote, setSelectedNote] = useState({ firstName: '', lastName: '' });
  const [data, setData] = useState();
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState();

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
      width: '150px'
    },
    {
      name: "LAST NAME",
      selector: (row) => row.lastName,
      sortable: true,
      width: '150px'
    },
    {
      name: "EMAIL",
      selector: (row) => (
        <span
          style={{ color: '#734dc4', cursor: 'pointer' }}
          onClick={() => handleView(row.email)}
        >
          {row.email}
        </span>
      ),
      sortable: true,
      width: '190px'
    },
    {
      name: "PHONE NUMBER",
      selector: (row) => row.phoneNumber,
      sortable: true,
      width: '150px'
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
      name: "ACTIVE",
      selector: (row) => {
        switch (row.active) {
          case 'N':
            return "NO";
          default:
            return "YES";
        }
      },
      sortable: true,
      width: '130px'
    },
    {
      name: "ACTION",
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
          <img
            src="edit.png"
            alt="Edit"
             onClick={() => handleEdit(row.email)}
            title="Edit"
            style={{ cursor: 'pointer', marginRight: '9px' }}
          />
          <img
            src="delete.png"
            alt="Delete"
            onClick={() => openUnpublishModal(row.email, row.firstName, row.lastName)}
            title="Delete"
            style={{ cursor: 'pointer' }}
          />
        </div>
      ),
      width: '140px'
    }
  ];

  const fetchData = async () => {
    try {
      const response = await api.get('/users');
      const res = response.data;
  
      if (Array.isArray(res)) {
        setData(res);
      } else {
        setData();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData();
    }
  };
  


  const handleView = (email) => {
    navigate(`/memberDetail/${email}`);
  };

  const handleEdit = (email) => {
    navigate(`/editadministrator/${email}`);
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
      showAlert("Please enter a remark before making user Inactive.", "info");
      return;
    }
  
    try {
      const userResponse = await api.get(`/users/${EmailId}`);
      const userData = userResponse.data;
  
      const updatedUserData = {
        ...userData,
        active: 'N',
        remark: remark.trim()
      };
  
      const updateResponse = await api.put(`/users/${EmailId}`, updatedUserData);
  
      if (updateResponse.status === 200) {
        setData(prevData => prevData.map(user =>
          user.email === EmailId ? { ...user, active: 'N', remark: remark.trim() } : user
        ));
        showSuccessToast('User status updated successfully.');
        closeUnpublishModal();
      } else {
        showErrorToast('Failed to update user status.');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      showErrorToast('Error updating user status.');
    }
  };
  

  useEffect(() => {
    fetchData();
  },);

  useEffect(() => {
    if (data) { // Check if data is defined
      // Filter by role first
      const roleFiltered = data.filter(item => item.role === 'Admin');
  
      // Then filter by search term
      const result = roleFiltered.filter(item =>
        item.firstName.toLowerCase().includes(search.toLowerCase()) ||
        item.lastName.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(result);
    }
  }, [data, search]);

  return (
    <div style={{ paddingTop: '100px' }}>
      <h1 style={{ marginLeft: '215px', color: '#734dc4', fontSize: '30px' }}>Manage Administrator</h1>
      <div className='container d-flex justify-content-center'>
        <div className='row'>
          <div className='col-md-12'>
            <DataTable
              className="datatable-border"
              columns={columns}
              data={filteredData}
              pagination
              paginationPerPage={5}
              fixedHeader
              selectableRowsHighlight
              highlightOnHover
              subHeader
              subHeaderComponent={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="col text-center">
                    <Link to="/addadministrator">
                      <button className="btn btn-sm" style={{ marginRight: '750px', backgroundColor: '#734dc4', color: 'white' }}>ADD ADMINISTRATOR</button>
                    </Link>
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
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h4>{selectedNote.firstName} - {selectedNote.lastName}</h4>
            <label>Are you sure you want to make this administrator inactive?</label>
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
      <ToastContainer />

    </div>
  );
}

export default Administrator;