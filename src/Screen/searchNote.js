import React from 'react'
import Banner from '../Component/banner';
import NotesGrid from '../Component/NotesGrid';

function searchNote() {
  return (
    <div>
      <Banner text="Search Notes" imageHeight="250px" />
      <NotesGrid />
    </div>
  )
}

export default searchNote