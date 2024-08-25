import React from 'react';
import { Outlet } from 'react-router-dom';
// import Header from '../components/Header';
import Footer from '../components/Footer';
// import Sidebar from '../components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
// import MainPanel from '../components/MainPanel';
import { useState } from 'react';
import MessagePopup from '../components/MessagePopup';
import DashboardPage from '../components/start';


const Dashboard = (role) => {
    const [showMessage, setShowMessage] = useState(true);

  // Auto-hide the message popup after 15 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => setShowMessage(false), 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="d-flex flex-column vh-100">
<DashboardPage />
      {/* <Header />  */}
      {/* {showMessage && <MessagePopup message="Welcome to the Dashboard!" />} */}
      <div className="d-flex margin-top: 0rem">
        {/* <Sidebar />
        <MainPanel />         */}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
