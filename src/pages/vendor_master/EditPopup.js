import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from "../constants";

function EditPopup({ onClose, onRowSelect }) {

    const [searchResults, setSearchResults] = useState([]);
    const [searchAcctName, setSearchAcctName] = useState('');

    const handleSearch = async () => {

        try {
            const response = await axios.get(`${BASE_URL}/api/search_account_master_vendor`, {
                params: {
                    p_account_name: searchAcctName || '',
                }
            });
            setSearchResults(response.data);
            console.log('response.data ==> ', response.data);
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };

    const handleSendData = async (selectedRow) => {
        console.log('Sending Selected Row:', selectedRow);

        try {
            const response = await axios.get(`${BASE_URL}/api/search_Acc_Master_ById_vendor`, {
                params: {
                    p_act_cd: selectedRow.act_cd || '',
                }
            });

            // Pass the selected row to the main component
            onRowSelect(response.data);
            console.log('response.data>>>>>>>', response.data);

        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };


    return (
        <div className="popup">
            <div className="popup-inner">
                <h5 className='header_color_search'>Edit Account Master</h5>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex ">
                        <label style={{ width: '150px', marginLeft: '8px' }} >Account Name</label>
                        <input type="text" className="form-control me-1 mb-3" value={searchAcctName}
                            onChange={(e) => setSearchAcctName(e.target.value)} size="sm" />
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button style={{ width: '150px', height: '40px' }} className="btn btn-primary me-3 btn-sm"
                            onClick={handleSearch} >Search</button>
                    </div>
                </div>
                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th hidden>act_cd</th>
                                <th>Account Name</th>
                                <th>Account Status</th>
                                <th>Ledger Type</th>
                            </tr>

                        </thead>
                        <tbody>
                            {searchResults.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td hidden>{result.act_cd}</td>
                                    <td>{result.account_name}</td>
                                    <td>{result.status}</td>
                                    <td>{result.ledg_type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </div>
            <button className="btn btn-secondary close_btn" onClick={onClose} style={{float: 'left'}}>Close</button>
        </div>
    );
}

export default EditPopup;
