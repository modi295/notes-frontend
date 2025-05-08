import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserEmail } from '../Services/auth';
import api from '../Services/api';

const AdDashboard = () => {
  const [data, setData] = useState({
    inReviewNotesCount: 0,
    newDownloadsCount: 0,
    newRegistrationsCount: 0
  });

  const email = getUserEmail();

  useEffect(() => {
    const fetchUserNotesData = async () => {
      try {
        const response = await api.get('/getAdminDashboardData');
        setData(response.data);
      } catch (error) {
        console.error('API request failed:', error.response?.data?.message || error.message);
      }
    };
  
    fetchUserNotesData();
  }, [email]);
  return (
    <div className="container-fluid" style={{ paddingTop: '90px' }}>
    <div className="row">
      <div className="col">
        <h1 style={{ color: '#734dc4', marginLeft: '200px' }}>Dashboard</h1>
      </div>
    </div>
    <div className="row mt-6 justify-content-center">

      <div className="col-xs-12  col-md-3 col-lg-3 col-xl-3" style={{ marginLeft: '1px', marginRight: '1px' }}>
        <Link to="/underReview" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ maxHeight: '100px' }}>
            <div className="card-body text-center">
              <h5 className="card-title" style={{ color: '#734dc4', fontWeight: 'bold' }}>{data.inReviewNotesCount}</h5>
              <p className="card-text" style={{ fontSize: 'small' }}>Number of Notes in Review for Publish</p>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-xs-12  col-md-3 col-lg-3 col-xl-3">
        <Link to="/alldownloadNotes" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ maxHeight: '100px' }}>
            <div className="card-body text-center">
              <h5 className="card-title" style={{ color: '#734dc4', fontWeight: 'bold' }}>{data.newDownloadsCount}</h5>
              <p className="card-text" style={{ fontSize: 'small' }}>Number of New Notes Downloaded (Last 7 Days)</p>
            </div>
          </div>
        </Link>
      </div>
      <div className="col-xs-12  col-md-3 col-lg-3 col-xl-3">
        <Link to="/member" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{ maxHeight: '100px' }}>
            <div className="card-body text-center">
              <h5 className="card-title" style={{ color: '#734dc4', fontWeight: 'bold' }}>{data.newRegistrationsCount}</h5>
              <p className="card-text" style={{ fontSize: 'small' }}>Numbers of New Registration (Last 7 Days)</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  </div>
  )
}

export default AdDashboard