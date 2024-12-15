// src/App.js
import React, { useState } from 'react';
import Open_Balance from './open_balance';

const OPENINGBALANCEApp = () => {
 
  const [details, setDetails] = useState([]);
 return (
      <div>
        <Open_Balance details={details} setDetails={setDetails}/>
      </div>
   
  );
}
  


export default OPENINGBALANCEApp ;
