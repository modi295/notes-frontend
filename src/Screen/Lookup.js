import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../css/grid.css';
import '../css/allPublishNotes.css';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import api from '../Services/api';
import { showConfirm } from '../Utility/ConfirmBox'; 
import { showSuccessToast, showErrorToast } from '../Utility/ToastUtility';

function Lookup() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await api.get('/getAllLookup');
      const res = response.data;
  
      if (Array.isArray(res)) {
        setData(res);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (Array.isArray(data)) {
      const result = data.filter(item =>
        (item.typeName?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.typeCode?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (item.typeId?.toLowerCase() || "").includes(search.toLowerCase())
      );
      setFilteredData(result);
    } else {
      setFilteredData([]);
    }
  }, [data, search]);

  const handleEdit = (typeId) => {
    navigate(`/editlookup/${typeId}`);
  };

  const handleDelete = async (typeId) => {
    const confirmed = await showConfirm("Are you sure you want to delete this lookup entry?");
    if (!confirmed) return;
  
    try {
      const response = await api.delete(`/deleteLookup/${typeId}`);
  
      if (response.status === 200) {
        showSuccessToast("Lookup deleted successfully!");
        fetchData(); 
      } else {
        showErrorToast("Failed to delete lookup. Please try again.");
      }
    } catch (error) {
      console.error('Error deleting lookup:', error);
      showErrorToast("An error occurred while deleting.");
    }
  };
  
  const columns = [
    {
      name: "S.NO",
      selector: (row, index) => index + 1,
      width: '100px',
      center: 'true'
    },
    {
      name: "ID",
      selector: (row) => row.typeId,
      sortable: true,
      width: '160px'
    },
    {
      name: "TYPE",
      selector: (row) => 
        row.typeCode === 'CON' ? 'Country' :
        row.typeCode === 'CAT' ? 'Category' :
        row.typeCode === 'TYP' ? 'Types' :
        row.typeCode,
      sortable: true,
      width: '190px'
    },
    {
      name: "TYPE NAME",
      selector: (row) => row.typeName,
      sortable: true,
      width: '200px'
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
      width: '150px'
    },
    {
        name: "UPDATED DATE",
        selector: (row) => {
          const createdAt = new Date(row.updatedAt);
          const day = createdAt.getDate().toString().padStart(2, '0');
          const month = (createdAt.getMonth() + 1).toString().padStart(2, '0');
          const year = createdAt.getFullYear();
          return `${day}-${month}-${year}`;
        },
        sortable: true,
        width: '150px'
      },
    {
      name: "ACTION",
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
          <img
            src="edit.png"
            alt="Edit"
            onClick={() => handleEdit(row.typeId)}
            title="Edit"
            style={{ cursor: 'pointer', marginRight: '9px' }}
          />
          <img
            src="delete.png"
            alt="Delete"
            onClick={() => handleDelete(row.typeId)}
            title="Delete"
            style={{ cursor: 'pointer' }}
          />
        </div>
      ),
      width: '140px'
    }
  ];

  return (
    <div style={{ paddingTop: '100px' }}>
      <ToastContainer />
      <h1 style={{ marginLeft: '215px', color: '#734dc4', fontSize: '30px' }}>Manage Lookup Codes</h1>
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
                    <Link to="/addlookup">
                      <button className="btn btn-sm" style={{ marginRight: '750px', backgroundColor: '#734dc4', color: 'white' }}>ADD LOOKUP CODE</button>
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
    </div>
  );
}

export default Lookup;
