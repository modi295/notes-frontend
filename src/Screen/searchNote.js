import React from 'react'
import Banner from '../Component/banner';
import Search from '../Component/Search';

function searchNote() {
  return (
    <div>
    <Banner text="Search Notes" imageHeight="250px" />
    <Search />
    </div>
  )
}

export default searchNote