import React from 'react'
import AllPublishNotes from '../Component/allPublishNotes';
import Dashboard from '../Component/Dashboard';

function AdminDashboard() {
  return (
<div>

     <Dashboard/>
     <h1 style={{ marginLeft: '115px', marginBottom: '0', marginTop:'30px',color: '#734dc4', fontSize: '30px' }}>All publish Notes</h1>
     <AllPublishNotes/>
    </div>
  )
}

export default AdminDashboard