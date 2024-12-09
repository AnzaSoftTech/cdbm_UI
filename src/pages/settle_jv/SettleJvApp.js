import React, { useState } from 'react';
import SettleJv from './SettleJv';

const SettleJvApp = () => {
  const [details, setDetails] = useState([]);
return (
      <div>
        <SettleJv details={details} setDetails={setDetails}/>
       
      </div>
  );
}
export default SettleJvApp 
