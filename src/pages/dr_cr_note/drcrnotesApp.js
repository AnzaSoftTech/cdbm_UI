
import React, { useState } from 'react';

import DrCr_Note from './drcr_note';

const DRCRNOTEApp = () => {
 
  const [details, setDetails] = useState([]);  
return (

      <div>
        <DrCr_Note details={details} setDetails={setDetails}/>
      </div>
  );
}
export default DRCRNOTEApp ;
