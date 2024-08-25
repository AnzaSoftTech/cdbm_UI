import React, { useState } from 'react';
import Journal from './journal';

const JOURNALApp = () => {
  const [details, setDetails] = useState([]);
return (
      <div>
        <Journal details={details} setDetails={setDetails}/>
       
      </div>
  );
}
export default JOURNALApp 
