import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file for styles
import MainPanel from './MainPanel';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaAngleDown, FaAngleRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('page1');

  const handleMenuItemClick = (page) => {
    setCurrentPage(page);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  // Handle clicks outside the sidebar
  const handleClickOutside = (event) => {
    if (isSidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.togglebtn')) {
      setIsSidebarOpen(false);
    }
  };

  const [openMenus, setOpenMenus] = useState({});



  const toggleMenu = (menuName) => {
    setOpenMenus({
      ...openMenus,
      [menuName]: !openMenus[menuName],
    });
  };

  // Add and clean up event listener for clicks outside the sidebar
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic
    navigate('/');
  };

  return (
    <div className='top'>
      <div className='d-flex justify-content-between '>
        <div>
           <button className="togglebtn" onClick={toggleSidebar}>
              {isSidebarOpen ? '✖' : '☰'}
          </button>
        </div>
        <div className='pt-2'>
           <h4>Sodhani Securities Ltd.</h4>
        </div>
        <div className='pt-2'>
             <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button> &nbsp;
        </div>
      </div>

      {/* Sidebar */}
      <div>
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="menu">

            <div className="menu-item">
              <div className="menu-title hamburger" onClick={() => toggleMenu("dashboard")}>
                <Link to="/dashboard" className="nav-link active">Dashboard</Link>
              </div>
            </div>
            <div className="menu-item hamburger">
              <div className="menu-title" onClick={() => toggleMenu("uploads")}>
                CDBM Uploads {openMenus.uploads ? <FaAngleDown /> : <FaAngleRight />}
              </div>
              {openMenus.uploads && (
                <div className="submenu">
                  <div className="submenu-item"><Link to="/dashboard/sauda_upload/su_mainapp" className="nav-link">Sauda Upload</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/main_file_upload/mf_mainapp" className="nav-link">Master File Upload</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/cash_net_position/cnp_mainapp" className="nav-link">Cash Net Position</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/sauda_report/sr_mainapp" className="nav-link">Sauda Report</Link></div>
                </div>
              )}
            </div>
            <div className="menu-item hamburger">
              <div className="menu-title" onClick={() => toggleMenu("financial")}>
                Finance {openMenus.financial ? <FaAngleDown /> : <FaAngleRight />}
              </div>
              {openMenus.financial && (
                <div className="submenu">
                  <div className="submenu-item"><Link to="/dashboard/payment_vouchar/Payment_voucharApp" className="nav-link"> Payment/Receipt Vouchers</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/journal_vouchar/JOURNALApp " className="nav-link">Journal Voucher</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/dr_cr_note/drcrnotesApp " className="nav-link">Debit/Credit Notes</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/Contra_Entry/contraenteryApp " className="nav-link"> Contra Entry</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/Bank_Reco/bankRecoApp " className="nav-link"> Bank Reconciliation</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/openingBalance/openingbalanceApp " className="nav-link">Opening Balance</Link></div>

                </div>
              )}
            </div>
            <div className="menu-item hamburger">
              <div className="menu-title" onClick={() => toggleMenu("reports")}>
                Reports {openMenus.reports ? <FaAngleDown /> : <FaAngleRight />}
              </div>
              {openMenus.reports && (
                <div className="submenu">
                  <div className="submenu-item"><Link to="/dashboard/trial_balance/tb_mainapp" className="nav-link">Trial Balance</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/ledger/l_mainapp" className="nav-link">Ledger</Link></div>
                  {/* <div className="submenu-item" ><Link to="/dashboard/page2" className="nav-link">page 2</Link></div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className={`overlay ${isSidebarOpen ? 'active' : ''}`}></div>

      <div className='main'>
        <MainPanel page={currentPage} />
      </div>
    </div>
  );
};

export default DashboardPage;
