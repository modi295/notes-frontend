import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserEmail } from '../Services/auth';

function Dashboard() {
  const [data, setData] = useState({
    soldNotesCount: 0,
    soldNotesTotalPrice: 0,
    downloadedNotesCount: 0,
    rejectedNotesCount: 0,
    buyerNotesCount: 0
  });

  const email = getUserEmail();

  useEffect(() => {
    const fetchUserNotesData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/getDashboardData/${email}`);
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          console.error('Error fetching data:', result.message);
        }
      } catch (error) {
        console.error('API request failed:', error);
      }
    };

    fetchUserNotesData();
  }, [email]);

  return (
    <div className="container-fluid" style={{ paddingTop: '90px' }}>
      <div className="row">
        <div className="col">
          <h1 className="text-center" style={{ color: '#734dc4' }}>Dashboard</h1>
        </div>
        <div className="col text-center">
          <Link to="/addNotes">
            <button className="btn btn-sm" style={{ marginLeft: '140px', backgroundColor: '#734dc4', color: 'white' }}>ADD NOTE</button>
          </Link>
        </div>
      </div>
      <div className="row mt-6 justify-content-center">
        <div className="col-xs-12 col-md-5 col-lg-5 col-xl-5">
          <Link to="/soldNotes" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ maxHeight: '100px' }}>
              <div className="card-body text-center">
                <div className="row">
                  <div className="col" style={{ borderRight: '1px solid #ccc' }}>
                    <img src="/myearning.png" className="card-img-top" style={{ width: '50px', height: '50px' }} alt="Earnings" />
                    <p className="card-title" style={{ color: '#734dc4', fontWeight: 'bold' }}>My Earning</p>
                  </div>
                  <div className="col">
                    <h5 className="card-title" style={{ color: '#734dc4', fontWeight: 'bold' }}>{data.soldNotesCount}</h5>
                    <p className="card-text">Number of Notes Sold</p>
                  </div>
                  <div className="col">
                    <h5 className="card-title" style={{ color: '#734dc4', fontWeight: 'bold' }}>${data.soldNotesTotalPrice}</h5>
                    <p className="card-text">Money Earned</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-xs-12 col-md-1 col-lg-1 col-xl-1" style={{ marginLeft: '1px', marginRight: '1px' }}>
          <Link to="/downloadNotes" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ maxHeight: '100px' }}>
              <div className="card-body text-center">
                <h5 className="card-title" style={{ color: '#734dc4', fontWeight: 'bold' }}>{data.downloadedNotesCount}</h5>
                <p className="card-text" style={{ fontSize: 'small' }}>My Downloads</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-xs-12 col-md-1 col-lg-1 col-xl-1">
          <Link to="/earnings" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ maxHeight: '100px' }}>
              <div className="card-body text-center">
                <h5 className="card-title" style={{ color: '#734dc4', fontWeight: 'bold' }}>{data.rejectedNotesCount}</h5>
                <p className="card-text" style={{ fontSize: 'small' }}>Rejected Notes</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-xs-12 col-md-1 col-lg-1 col-xl-1">
          <Link to="/BuyRequest" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ maxHeight: '100px' }}>
              <div className="card-body text-center">
                <h5 className="card-title" style={{ color: '#734dc4', fontWeight: 'bold' }}>{data.buyerNotesCount}</h5>
                <p className="card-text" style={{ fontSize: 'small' }}>Buyer Requests</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
