import React, { useState } from 'react';
import axios from 'axios';
import './ClientSearchPop.css';
import { BASE_URL } from ".././constants";

function ClientSearchPop({ onRowSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [clients, setClients] = useState([]);

    const handleClientSearch = async () => {
        try {
            // 'http://localhost:3004/api/searchclient
            const response = await axios.get(`${BASE_URL}api/searchclient`, {
                params: { name: searchTerm }
            });
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
            <div className='div_header'><h4 >Search Client</h4></div>
                <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='input_margin'
                />
                <button className='button_search' onClick={handleClientSearch}>Search</button></div>
                <div className='div_overflow table_margin'><table>
                    <thead>
                        <tr>
                            <th>Client Code</th>
                            <th>Client Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.client_cd} onClick={() => onRowSelect(client.client_name,client.client_cd)}>
                                <td>{client.client_cd}</td>
                                <td>{client.client_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table></div>
                <button className='input_margin' onClick={() => onRowSelect(null)}>Close</button>
            </div>
        </div>
    );
}

export default ClientSearchPop;
