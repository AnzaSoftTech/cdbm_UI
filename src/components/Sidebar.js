// import React, { useState } from "react";
// import { FaBars, FaAngleDown, FaAngleRight } from "react-icons/fa";
// import './Sidebar.css'; // Import your custom CSS for styling
// import { Link } from 'react-router-dom';

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [openMenus, setOpenMenus] = useState({});

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const toggleMenu = (menuName) => {
//     setOpenMenus({
//       ...openMenus,
//       [menuName]: !openMenus[menuName],
//     });
//   };

//   return (

//   <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
//       <div className="hamburger" onClick={toggleSidebar}>
//         <FaBars />
//       </div>
//       <div className="menu">
//       <div className="menu-item">
//           <div className="menu-title" onClick={() => toggleMenu("dashboard")}>
//           <Link to="/dashboard" className="nav-link active">Dashboard</Link>
//           </div>         
//         </div>
//         <div className="menu-item">
//           <div className="menu-title" onClick={() => toggleMenu("uploads")}>
//             Uploads {openMenus.uploads ? <FaAngleDown /> : <FaAngleRight />}
//           </div>
//           {openMenus.uploads && (
//             <div className="submenu">
//               <div className="submenu-item"><Link to="/dashboard/sauda_upload/su_mainapp" className="nav-link">Sauda Upload</Link></div>
//               <div className="submenu-item"><Link to="/dashboard/main_file_upload/mf_mainapp" className="nav-link">Main File Upload</Link></div>
//             </div>
//           )}
//         </div>
//         <div className="menu-item">
//           <div className="menu-title" onClick={() => toggleMenu("financial")}>
//             Financial {openMenus.financial ? <FaAngleDown /> : <FaAngleRight />}
//           </div>
//           {openMenus.financial && (
//             <div className="submenu">
//               <div className="submenu-item"><Link to="/dashboard/trial_balance/tb_mainapp" className="nav-link">Trial Balance</Link></div>
//               <div className="submenu-item"><Link to="/dashboard/ledger/l_mainapp" className="nav-link">Ledger</Link></div>
//               <div className="submenu-item"><Link to="/dashboard/cash_net_position/cnp_mainapp" className="nav-link">Cash Net Position</Link></div>
//             </div>
//           )}
//         </div>
//         <div className="menu-item">
//           <div className="menu-title" onClick={() => toggleMenu("reports")}>
//             Reports {openMenus.reports ? <FaAngleDown /> : <FaAngleRight />}
//           </div>
//           {openMenus.reports && (
//             <div className="submenu">
//               <div className="submenu-item"><Link to="/dashboard/sauda_report/sr_mainapp" className="nav-link">Sauda Report</Link></div>
//               <div className="submenu-item" ><Link to="/dashboard/page2" className="nav-link">page 2</Link></div>
//             </div>
//           )}
//         </div>
//       </div>
     
//     </div>
    

    
//   );
// };

// export default Sidebar;
