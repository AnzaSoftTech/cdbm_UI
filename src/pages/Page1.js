import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import RightPanel from '../components/Rightpanel';

const Page1 = () => {
  return (
    <div className="d-flex flex-column vh-100">
    <div className="d-flex flex-grow-1">
      <main className="flex-grow-1">
      Page 1
      </main>
      </div>
  </div>
  );
};

export default Page1;
