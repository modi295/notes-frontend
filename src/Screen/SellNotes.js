import React from 'react'
import PublishNotes from '../Component/publishNotes';
import InProgressNotes from '../Component/InProgressNotes';
import Dashboard from '../Component/Dashboard';

function SellNotes() {
  return (
    <div>
      <Dashboard />
      <InProgressNotes />
      <PublishNotes />
    </div>
  )
}

export default SellNotes




