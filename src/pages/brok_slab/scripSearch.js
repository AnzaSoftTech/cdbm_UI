import React, { useState } from 'react';
import axios from 'axios';
import './gen_rings';
import { BASE_URL } from ".././constants";


function ScripSearchPop({ onRowSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [scrips, setScrips] = useState([]);

    const handleScripSearch = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/searchScrip`, {
                params: { name: searchTerm}
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
        <div className="popup_ring ">
            <div className="popup-inner_ring">
                <div className='div_header_ring'><h4 className='search_header'>Search Scrip</h4></div>


                <div className="paddingScrip">
                    <div className='d-flex my-4'>
                        <input
                            className='form-control mx-2'
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder='Scrip Name'
                            style={{ width: '50%' }}
                        />
                        <button className='btn btn-primary me-2' onClick={handleScripSearch}>Search</button>
                        <button className='btn btn-danger' onClick={handleClose}>Close</button>
                    </div>
                    <div className='table-scroll'>
                        <table className='tablering'>
                            <thead className='theadring'>
                                <tr>
                                    <th className='thring'>Scrip Code </th>
                                    <th className='thring'>Scrip Name</th>
                                </tr>
                            </thead>
                            <tbody className='tbodyring'>
                                {scrips.map(scrip => (
                                    <tr className='trring' key={scrip.scrip_cd} onClick={() => onRowSelect(scrip.series, scrip.scrip_cd)}>
                                        <td className='tdring'>{scrip.scrip_cd}</td>
                                        <td className='tdring'>{scrip.sec_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScripSearchPop;
