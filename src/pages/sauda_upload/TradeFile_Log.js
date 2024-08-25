import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewLogPopup.css';

function ErrorLogPopup({ onCloseClick }) {
    // const [searchTerm, setSearchTerm] = useState('');
    const [viewlogs, setViewlogs] = useState([]);

     useEffect (() => {
                axios.get('http://localhost:3001/api/trade_view_log')
                .then(response => setViewlogs(response.data))
                .catch(error => console.error('Error fetching branches:', error));
        }, []);
        
      //if (!isOpen) return null;

    //const handleclose = () => {onClose();};

    return (
        <div className="popup">
            <div className="popup-inner">
            {/* <div className='div_header'><h4 className='search_header'>View Log</h4></div>
                <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='input_margin'
                />
                <button className='button_search' onClick={handleClientSearch}>Search</button>
            </div> */}
                <div className='div_overflow table_margin'><table>
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Uploaded Datetime</th>
                            <th>Status</th>
                            <th>Uploaded By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {viewlogs.map((viewlog) => (
                            <tr key={viewlog.file_name}>
                                <td>{viewlog.file_name}</td>
                                <td>{viewlog.uplod_datetime}</td>
                                <td>{viewlog.status}</td>
                                <td>{viewlog.upld_by}</td>
                            </tr>
                        ))}
                    </tbody>
                </table></div>
                {/* <button className='input_margin' onClick={() => onCloseClick(null) }>Close</button>  */}
                <button className='btn input_margin btn-secondary ' onClick={() => onCloseClick(null) }>Close</button> 
            </div>
        </div>
    );
}

export default ErrorLogPopup;
