import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewLogPopup.css';
import { BASE_URL } from "../constants";



function Client_Missing_Exc_Link_Popup({onCloseClick}) {
    // const [searchTerm, setSearchTerm] = useState('');
    const [viewlogs, setViewlogs] = useState([]);

   
    useEffect(() => {
         axios.get(`${BASE_URL}/api/clnt_not_exc_link_popup`)
         .then(response => setViewlogs(response.data))
                .catch(error => console.error('Error fetching branches:', error));
        }, []);


    //const handleclose = () => {onClose();};

    return (
        <div className="popup">
            <div className="popup-inner">
             <div className='div_header_warn'><h4 className='search_header'>Client Missing in Exchange Link</h4></div>
                {/* <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='input_margin'
                />
                <button className='button_search' onClick={handleClientSearch}>Search</button>
            </div>  */}
                <div className=' table_margin' style={{lineHeight:'1'}}><table>
                    <thead>
                        <tr>
                            <th>Client Code</th>
                            <th>Trade No</th>
                            <th>Error Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {viewlogs.map((viewlog) => (
                            <tr key={viewlog.client_code}>
                                <td>{viewlog.client_code}</td>
                                <td>{viewlog.trade_no}</td>
                                <td>{viewlog.err_message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table></div>
                <button className='input_margin' onClick={() => onCloseClick(null) }>Close</button> 
            </div>
        </div>
    );
}

export default Client_Missing_Exc_Link_Popup;
