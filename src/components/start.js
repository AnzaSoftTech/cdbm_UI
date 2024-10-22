import React, { useState, useEffect } from 'react';
import { FaBars, FaAngleDown, FaAngleRight, FaFileUpload, FaMoneyCheck, FaChartPie, FaFolderOpen } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import MainPanel from './MainPanel';
import './App.css'; // Import the CSS file for styles
// import MainPanel from './MainPanel';
// import { useNavigate } from 'react-router-dom';
// import { FaBars, FaAngleDown, FaAngleRight } from "react-icons/fa";
// import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [currentPage, setCurrentPage] = useState('page1');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMenu = (menuName) => {
    setOpenMenus({
      ...openMenus,
      [menuName]: !openMenus[menuName],
    });
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center p-2 bg-blue-600 text-white shadow">
        <h4 className="text-lg font-semibold">Sodhani Securities Ltd.</h4>

        {/* Sidebar Toggle Button */}
        <button className="togglebtn" onClick={toggleSidebar}>
          {isSidebarOpen ? '✖' : '☰'}
        </button>

        <button className="btn btn-outline-light text-white border border-white px-4 py-1 rounded" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`sidebar bg-blue-800 text-white w-64 h-screen fixed top-0 left-0 z-1 transition-transform duration-300 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="menu space-y-4 mt-8">
            {/* Dashboard */}
            <div className="menu-item">
              <div className="menu-title flex items-center px-4 py-2 hover:bg-blue-600" onClick={() => toggleMenu("dashboard")}>
                <FaChartPie className="mr-2" />
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              </div>
            </div>

            {/* CDBM Uploads */}
            <div className="menu-item">
              <div className="menu-title flex items-center justify-between px-4 py-2 hover:bg-blue-600 cursor-pointer" onClick={() => toggleMenu("uploads")}>
                <span className="flex items-center"><FaFileUpload className="mr-2" /> CDBM Uploads</span>
                {openMenus.uploads ? <FaAngleDown /> : <FaAngleRight />}
              </div>
              {openMenus.uploads && (
                <div className="submenu space-y-4 pl-16">
                  <div className="submenu-item"><Link to="/dashboard/sauda_upload/su_mainapp" className="nav-link hover:text-gray-300">Sauda Upload</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/main_file_upload/mf_mainapp" className="nav-link hover:text-gray-300">Master File Upload</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/cash_net_position/cnp_mainapp" className="nav-link hover:text-gray-300">Cash Net Position</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/sauda_report/sr_mainapp" className="nav-link hover:text-gray-300">Sauda Report</Link></div>
                </div>
              )}
            </div>

            {/* Finance */}
            <div className="menu-item">
              <div className="menu-title flex items-center justify-between px-4 py-2 hover:bg-blue-600 cursor-pointer" onClick={() => toggleMenu("financial")}>
                <span className="flex items-center"><FaMoneyCheck className="mr-2" /> Finance</span>
                {openMenus.financial ? <FaAngleDown /> : <FaAngleRight />}
              </div>
              {openMenus.financial && (
                <div className="submenu space-y-2 pl-16">
                  <div className="submenu-item"><Link to="/dashboard/Cash_Bank_Master/CashBankMasterApp" className="nav-link hover:text-gray-300">Cash/Bank Master</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/payment_vouchar/Payment_voucharApp" className="nav-link hover:text-gray-300">Payment/Receipt Vouchers</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/journal_vouchar/JOURNALApp" className="nav-link hover:text-gray-300">Journal Voucher</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/dr_cr_note/drcrnotesApp" className="nav-link hover:text-gray-300">Debit/Credit Notes</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/Contra_Entry/contraenteryApp" className="nav-link hover:text-gray-300">Contra Entry</Link></div>
                </div>
              )}
            </div>

            {/* Reports */}
            <div className="menu-item">
              <div className="menu-title flex items-center justify-between px-4 py-2 hover:bg-blue-600 cursor-pointer" onClick={() => toggleMenu("reports")}>
                <span className="flex items-center"><FaFolderOpen className="mr-2" /> Reports</span>
                {openMenus.reports ? <FaAngleDown /> : <FaAngleRight />}
              </div>
              {openMenus.reports && (
                <div className="submenu space-y-2 pl-16">
                  <div className="submenu-item"><Link to="/dashboard/trial_balance/tb_mainapp" className="nav-link hover:text-gray-300">Trial Balance</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/ledger/l_mainapp" className="nav-link hover:text-gray-300">Ledger</Link></div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`overlay flex-1 pl-1 bg-white ${isSidebarOpen ? 'ml-64' : ''}`}>
          <MainPanel page={currentPage} />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
