import React, { useState, useEffect } from 'react';
import './App.css';
import MainPanel from './MainPanel';
import { useNavigate } from 'react-router-dom';
import { FaAngleDown, FaAngleRight, FaHome, FaUpload, FaFileAlt, FaRupeeSign, FaFileInvoiceDollar, FaBook, FaBookOpen, FaCogs, FaExchangeAlt, FaUserTie } from "react-icons/fa";
import { FaArrowsUpToLine, FaBuildingColumns, FaHandHoldingDollar, FaScaleBalanced, FaPlusMinus, FaChartPie, FaUserTag, FaUserPen, FaLink } from "react-icons/fa6";
import { BsLayoutTextWindow, BsCloudUpload, BsFillJournalBookmarkFill, BsJournals, BsJournalCode, BsGraphUpArrow, BsListColumns, BsPercent, 
          BsBookmarkCheck, BsBookmarkCheckFill, BsBuildings, BsDiagram3 } from "react-icons/bs";

import { Link } from 'react-router-dom';
// FaDollarSign
const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage] = useState('page1');
  const [openMenus, setOpenMenus] = useState({});

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  // Handle clicks outside the sidebar
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClickOutside = (event) => {
    if (isSidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.togglebtn')) {
      setIsSidebarOpen(false);
    }
  };

//   const [openMenus, setOpenMenus] = useState({});

const toggleMenu = (menuName) => {
  console.log('before openMenus ', openMenus);
    setOpenMenus((prevOpenMenus) => ({
      [menuName]: !prevOpenMenus[menuName]
    }));
   console.log('after openMenus ', openMenus);
  };


  // Add and clean up event listener for clicks outside the sidebar
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside, isSidebarOpen]);

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
        <div className='pt-1'>
             <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button> &nbsp;
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="menu">

          {/* Dashboard */}
          <div className="menu-item">
            <div className="menu-title" onClick={() => toggleMenu("dashboard")}>
              <FaHome style={{ fontSize: '23px' }} />
             
              <Link to="/dashboard" className="nav-link active">Dashboard </Link>{<FaAngleRight />}
            </div>
          </div>

          {/* CDBM Uploads */}
          <div className="menu-item">
            <div className="menu-title" onClick={() => toggleMenu("uploads")}>
              <FaUpload style={{ fontSize: '23px' }} />
              CDBM Uploads {openMenus.uploads ? <FaAngleDown /> : <FaAngleRight />}
            </div>
            {openMenus.uploads && (
              <div className="submenu">
                <div className="submenu-item"><Link to="/dashboard/sauda_upload/su_mainapp" className="nav-link"><BsCloudUpload style={{ marginRight: '8px' }} />Sauda Upload</Link></div>
                <div className="submenu-item"><Link to="/dashboard/main_file_upload/mf_mainapp" className="nav-link"><FaArrowsUpToLine style={{ marginRight: '8px' }} />Master File Upload</Link></div>
                <div className="submenu-item"><Link to="/dashboard/cash_net_position/cnp_mainapp" className="nav-link"><BsBookmarkCheckFill style={{ marginRight: '8px' }} />Cash Net Position</Link></div>
                <div className="submenu-item"><Link to="/dashboard/sauda_report/sr_mainapp" className="nav-link"><BsBookmarkCheck style={{ marginRight: '8px' }} />Sauda Report</Link></div>
              </div>
            )}
          </div>

          {/* Finance */}
          <div className="menu-item">
            <div className="menu-title" onClick={() => toggleMenu("financial")}>
              <FaRupeeSign style={{ fontSize: '23px' }} />
              Finance {openMenus.financial ? <FaAngleDown /> : <FaAngleRight />}
            </div>
            {openMenus.financial && (
              <div className="submenu">
                  <div className="submenu-item"><Link to="/dashboard/booktype_master/Book_Type_MasterApp" className="nav-link"><BsFillJournalBookmarkFill style={{ marginRight: '8px' }} />Book Type</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/cashbank_master/CashBank_MasterApp" className="nav-link"><FaBuildingColumns style={{ marginRight: '8px' }} />Cash/Bank Master</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/account_master/Account_MasterApp" className="nav-link"><BsJournals style={{ marginRight: '8px' }} />Account Master</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/payment_vouchar/Payment_voucharApp" className="nav-link"><FaHandHoldingDollar style={{ marginRight: '8px' }} /> Payment/Receipt </Link></div>
                  <div className="submenu-item"><Link to="/dashboard/journal_vouchar/JOURNALApp " className="nav-link"><BsLayoutTextWindow style={{ marginRight: '8px' }} />Journal Voucher</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/dr_cr_note/drcrnotesApp " className="nav-link"><FaPlusMinus style={{ marginRight: '8px' }} />Debit/Credit Notes</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/Contra_Entry/contraenteryApp " className="nav-link"><BsJournalCode style={{ marginRight: '8px' }} /> Contra Entry</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/Bank_Reco/bankRecoApp " className="nav-link"><FaScaleBalanced style={{ marginRight: '8px' }} /> Bank Reconciliation</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/openingBalance/openingbalanceApp " className="nav-link"><FaBookOpen style={{ marginRight: '8px' }} />Opening Balance</Link></div>
                {/* Additional financial submenu items here */}
              </div>
            )}
          </div>

          {/* Masters */}
          <div className="menu-item">
            <div className="menu-title" onClick={() => toggleMenu("masters")}>
              <BsDiagram3 style={{ fontSize: '23px'}} />
              Masters {openMenus.masters ? <FaAngleDown /> : <FaAngleRight />}
            </div>
            {openMenus.masters && (
              <div className="submenu">
                  <div className="submenu-item"><Link to="/dashboard/" className="nav-link"><BsBuildings style={{ marginRight: '8px' }} />MII Master</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/" className="nav-link"><FaUserTag style={{ marginRight: '8px' }} />Vendor Master</Link></div>
                {/* Additional financial submenu items here */}
              </div>
            )}
          </div>

           {/* Client Masters */}

           {/* <div className="menu-item">
            <div className="menu-title" onClick={() => toggleMenu("clientmaster")}>
              <FaUserTie style={{ fontSize: '23px' }} />
              Client Master {openMenus.clientmaster ? <FaAngleDown /> : <FaAngleRight />}
            </div>
            {openMenus.clientmaster && (
              <div className="submenu">
                  <div className="submenu-item"><Link to="/dashboard/" className="nav-link"><FaUserPen style={{ marginRight: '8px' }} />Client Registration</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/" className="nav-link"><BsPercent style={{ marginRight: '8px' }} />Brokerage Slab</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/" className="nav-link"><FaLink style={{ marginRight: '8px' }} />Link Client/Slab</Link></div>
              </div>
            )}
          </div> */}


          {/* Reports */}
          <div className="menu-item">
            <div className="menu-title" onClick={() => toggleMenu("reports")}>
              <BsGraphUpArrow style={{ fontSize: '23px' }} />
              Reports {openMenus.reports ? <FaAngleDown /> : <FaAngleRight />}
            </div>
            {openMenus.reports && (
              <div className="submenu">
                <div className="submenu-item"><Link to="/dashboard/trial_balance/tb_mainapp" className="nav-link"><FaChartPie style={{ marginRight: '8px' }} />Trial Balance</Link></div>
                <div className="submenu-item"><Link to="/dashboard/ledger/l_mainapp" className="nav-link"><BsListColumns style={{ marginRight: '8px' }} />Ledger</Link></div>
                <div className="submenu-item"><Link to="/dashboard/pdfGenerate/SettlementReport" className="nav-link"><FaFileInvoiceDollar style={{ marginRight: '8px' }} />Contract Notes</Link></div>
                {/* <div className="submenu-item" ><Link to="/dashboard/page2" className="nav-link">page 2</Link></div> */}              </div>
            )}
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
