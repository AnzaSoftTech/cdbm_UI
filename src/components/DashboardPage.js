import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainPanel from './MainPanel';
import './DashboardPage.css';

const DashboardPage = () => {
  const [currentPage, setCurrentPage] = useState('page1');

  const handleMenuItemClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="content">
        <Sidebar onMenuItemClick={handleMenuItemClick} />
        <MainPanel page={currentPage} />
      </div>
    </div>
  );
};

export default DashboardPage;
