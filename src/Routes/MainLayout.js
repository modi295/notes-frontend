// components/MainLayout.js
import React from 'react';
import Navigation from '../Component/Navigation';
import Footer from '../Component/footer';

const MainLayout = ({ children }) => {
  return (
    <>
      <Navigation />
      <div className="screen-content">{children}</div>
      <Footer />
    </>
  );
};

export default MainLayout;
