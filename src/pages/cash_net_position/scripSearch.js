import React, { useState } from 'react';
import axios from 'axios';
import './ClientSearchPopup.css';


function ScripSearchPop({ onRowSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [scrips, setScrips] = useState([]);

    const handleScripSearch = async () => {
        try {
            const response = await axios.get('http://localhost:3004/api/searchScrip', {
                params: { name: searchTerm }
            });
            setScrips(response.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };
    const handleClose = () => {
        // Reset searchTerm state to empty string
        setSearchTerm('');
        // Call onRowSelect with null or any other necessary cleanup
        onRowSelect(null);
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <div className='div_header'><h4 className='search_header'>Search Scrip</h4></div>


                <div className="paddingScrip">
                    <div >
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className='button_search' onClick={handleScripSearch}>Search</button></div>
                    <div className='div_overflow'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Scrip Code </th>
                                    <th>Scrip Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scrips.map(scrip => (
                                    <tr key={scrip.scrip_cd} onClick={() => onRowSelect(scrip.sec_name, scrip.scrip_cd)}>
                                        <td>{scrip.scrip_cd}</td>
                                        <td>{scrip.sec_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button onClick={handleClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default ScripSearchPop;
