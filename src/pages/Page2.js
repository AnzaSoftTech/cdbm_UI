import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Page.css';

const Page2 = () => {
  return (
    <div className="container ml-auto">
    <div className="row d-flex align-items-center border">
      <div className="col-12 border">
        One of three columns
      </div>      
    </div>
    <div className="row d-flex align-items-center border">
      <div className="col-3 border">
        One of three columns
      </div>
      <div className="col-3 border">
        One of three columns
      </div>
      <div className="col-3 border">
        One of three columns
      </div>
      <div className="col-3 border">
        One of three columns
      </div>
    </div>
    <div className="row d-flex align-items-end border">
      <div className="col-3 border">
        One of three columns
      </div>
      <div className="col-3 border">
        One of three columns
      </div>
      <div className="col-3 border">
        One of three columns
      </div>
      <div className="col-3 border">
        One of three columns
      </div>
    </div>
  </div>
  );
};

export default Page2;
