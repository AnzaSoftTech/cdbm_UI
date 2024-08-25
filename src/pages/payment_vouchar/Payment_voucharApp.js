// src/App.js
import React, { useState } from 'react';

import Payment_Voucher from './payment_voucher';

const PAYMENT_VOUCHARApp = () => {
  
  const [details, setDetails] = useState([]);
return ( 
      <div>
        <Payment_Voucher details={details} setDetails={setDetails}/>s
      </div>
   
  );
}
export default PAYMENT_VOUCHARApp;
