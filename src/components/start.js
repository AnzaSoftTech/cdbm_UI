import React, { useState, useEffect } from 'react';
import './App.css';
import MainPanel from './MainPanel';
import { useNavigate } from 'react-router-dom';
import { FaAngleDown, FaAngleRight, FaHome, FaUpload, FaFileAlt, FaRupeeSign, FaFileInvoiceDollar, FaBook, FaBookOpen, FaCogs, FaExchangeAlt,  FaUserTie, FaHive,FaUserShield } from "react-icons/fa";
import { FaArrowsUpToLine, FaBuildingColumns, FaHandHoldingDollar, FaScaleBalanced, FaPlusMinus, FaChartPie, FaUserTag, FaUserPen, FaLink, FaBookOpenReader } from "react-icons/fa6";
import { BsLayoutTextWindow, BsCloudUpload, BsFillJournalBookmarkFill, BsJournals, BsJournalCode, BsGraphUpArrow, BsListColumns, BsPercent, 
          BsBookmarkCheck, BsBookmarkCheckFill, BsBuildings, BsDiagram3 } from "react-icons/bs";
          import { GrShieldSecurity } from "react-icons/gr";
import { HiUsers } from "react-icons/hi2";
import { HiReceiptTax } from "react-icons/hi";

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
             
              <Link to="/dashboard" className="sidebar_link active sidebar">Dashboard </Link>{<FaAngleRight />}
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
                <div className="submenu-item"><Link to="/dashboard/sauda_upload/su_mainapp" className="sidebar_link"><BsCloudUpload style={{ marginRight: '8px' }} />Sauda Upload</Link></div>
                <div className="submenu-item"><Link to="/dashboard/main_file_upload/mf_mainapp" className="sidebar_link"><FaArrowsUpToLine style={{ marginRight: '8px' }} />Master File Upload</Link></div>
                <div className="submenu-item"><Link to="/dashboard/cash_net_position/cnp_mainapp" className="sidebar_link"><BsBookmarkCheckFill style={{ marginRight: '8px' }} />Cash Net Position</Link></div>
                <div className="submenu-item"><Link to="/dashboard/sauda_report/sr_mainapp" className="sidebar_link"><BsBookmarkCheck style={{ marginRight: '8px' }} />Sauda Report</Link></div>
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
                  <div className="submenu-item"><Link to="/dashboard/booktype_master/Book_Type_MasterApp" className="sidebar_link"><BsFillJournalBookmarkFill style={{ marginRight: '8px' }} />Book Type</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/cashbank_master/CashBank_MasterApp" className="sidebar_link"><FaBuildingColumns style={{ marginRight: '8px' }} />Cash/Bank Master</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/account_master/Account_MasterApp" className="sidebar_link"><BsJournals style={{ marginRight: '8px' }} />Account Master</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/payment_vouchar/Payment_voucharApp" className="sidebar_link"><FaHandHoldingDollar style={{ marginRight: '8px' }} /> Payment/Receipt </Link></div>
                  <div className="submenu-item"><Link to="/dashboard/journal_vouchar/JOURNALApp " className="sidebar_link"><BsLayoutTextWindow style={{ marginRight: '8px' }} />Journal Voucher</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/settle_jv/SettleJvApp " className="sidebar_link"><BsLayoutTextWindow style={{ marginRight: '8px' }} />Settle JV</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/dr_cr_note/drcrnotesApp " className="sidebar_link"><FaPlusMinus style={{ marginRight: '8px' }} />Debit/Credit Notes</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/Contra_Entry/contraenteryApp " className="sidebar_link"><BsJournalCode style={{ marginRight: '8px' }} /> Contra Entry</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/Bank_Reco/bankRecoApp " className="sidebar_link"><FaScaleBalanced style={{ marginRight: '8px' }} /> Bank Reco</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/openingBalance/openingbalanceApp " className="sidebar_link"><FaBookOpen style={{ marginRight: '8px' }} />Opening Balance</Link></div>
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
                  <div className="submenu-item"><Link to="/dashboard/mii_master/MII_MasterApp" className="sidebar_link"><BsBuildings style={{ marginRight: '8px' }} />MII Master</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/vendor_master/Vendor_MasterApp" className="sidebar_link"><FaUserTag style={{ marginRight: '8px' }} />Vendor Master</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/activity_master/Activity_MasterApp" className="sidebar_link"><GrShieldSecurity style={{ marginRight: '8px' }} />Activity Master</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/segment_master/Segment_MasterApp" className="sidebar_link"><FaHive style={{ marginRight: '8px' }} />Segment Master</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/doc_mapp_master/Doc_Mapp_Master_MasterApp" className="sidebar_link"><FaUserTag style={{ marginRight: '8px' }} />Doc Mapp Master</Link></div>
                {/* Additional financial submenu items here */}
              </div>
            )}
          </div>

           {/* Client Masters */}

           <div className="menu-item">
            <div className="menu-title" onClick={() => toggleMenu("clientmaster")}>
              <FaUserTie style={{ fontSize: '23px' }} />
              Client Master {openMenus.clientmaster ? <FaAngleDown /> : <FaAngleRight />}
            </div>
            {openMenus.clientmaster && (
              <div className="submenu">
                  <div className="submenu-item"><Link to="/dashboard/Client_Master/client_masterApp" className="sidebar_link"><FaUserPen style={{ marginRight: '8px' }} />Client Registration</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/brok_slab/Brok_slab_masterApp" className="sidebar_link"><BsPercent style={{ marginRight: '8px' }} />Brokerage Slab</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/client_link_slab/Client_link_slab_masterApp" className="sidebar_link"><FaLink style={{ marginRight: '8px' }} />Link Client/Slab</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/dealer_sub_dealer/Dealer_Sub_DealerApp" className="sidebar_link"><HiUsers style={{ marginRight: '8px' }} />Dealer Sub-Dealer</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/dealer_slab_master/Dealer_Slab_MasterApp" className="sidebar_link"><HiReceiptTax style={{ marginRight: '8px' }} />Dealer Slab Master</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/family_grp/FamGrp_MasterApp" className="sidebar_link"><FaLink style={{ marginRight: '8px' }} />Family Group</Link></div>
                  <div className="submenu-item"><Link to="/dashboard/client_grp/ClientGrp_MasterApp" className="sidebar_link"><FaLink style={{ marginRight: '8px' }} />Client Group</Link></div>
              </div>
            )}
          </div>


          {/* Reports */}
          <div className="menu-item">
            <div className="menu-title" onClick={() => toggleMenu("reports")}>
              <BsGraphUpArrow style={{ fontSize: '23px' }} />
              Reports {openMenus.reports ? <FaAngleDown /> : <FaAngleRight />}
            </div>
            {openMenus.reports && (
              <div className="submenu">
                <div className="submenu-item"><Link to="/dashboard/day_book/daybookapp" className="sidebar_link"><FaBookOpenReader style={{ marginRight: '8px' }} />Day Book</Link></div>
                <div className="submenu-item"><Link to="/dashboard/trial_balance/tb_mainapp" className="sidebar_link"><FaChartPie style={{ marginRight: '8px' }} />Trial Balance</Link></div>
                <div className="submenu-item"><Link to="/dashboard/ledger_report/ledger_report_app" className="sidebar_link"><BsListColumns style={{ marginRight: '8px' }} />Ledger</Link></div>
                <div className="submenu-item"><Link to="/dashboard/pdfGenerate/SettlementReport" className="sidebar_link"><FaFileInvoiceDollar style={{ marginRight: '8px' }} />Contract Notes</Link></div>
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
