import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PopupCss.css'; // Adjust the path as per your file structure
import { BASE_URL } from ".././constants";

function EditPopup({ onClose ,onRowSelect }) {
    
    const [searchResults, setSearchResults] = useState([]);
    const [searchMiiName, setSearchMiiName] = useState('');


    const handleSearch = async () => {

        try {
            const response = await axios.get(`${BASE_URL}/api/search_Mii_Master`, {
                params: {
                    p_mii_name: searchMiiName || '', 
                }
            });
            setSearchResults(response.data);
            console.log('response.data ==> ', response.data);
           // console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };

    const handleSendData = async(selectedRow) => {
        //console.log('Sending Selected Row:', selectedRow);
    
        try {
            const response = await axios.get(`${BASE_URL}/api/search_Mii_Master_ById`, {
                params: {
                    p_mii_id:selectedRow.mii_id || ''
                }
            });

            //console.log('API response data:', response.data);
            // Pass the selected row to the main component
            onRowSelect(response.data);
    
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };
    

    return (
        <div className="popup">
            <div className="popup-inner">
                <h4 className='header_color_search'>Edit MII Master</h4>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex ">
                        <label style={{width:'150px', marginLeft:'8px'}} >MII Name</label>
                            <input type="text" className="form-control me-1 mb-3" value={searchMiiName} 
                             onChange={(e) => setSearchMiiName(e.target.value)} size="sm" />
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button style={{width:'150px', height:'40px'}} className="btn btn-primary me-3 btn-sm"
                         onClick={handleSearch} >Search</button>
                    </div>
                </div>
                {/* <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex">
                        <label style={{width:'150px', marginLeft:'8px'}}>Account No:</label>
                        <input type="text" className="form-control accountName_input mb-3" value={searchAccountNo} 
                         onChange={(e) => setSearchAccountNo(e.target.value)} size="sm" />
                    </div>
                </div> */}
                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>MII Name</th>
                                <th>MII Short Name</th>
                                <th >SEBI Regsn No.</th>
                                <th hidden>mii_id</th>
                            </tr>

                        </thead>
                        <tbody>
                            {searchResults.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.mii_name}</td>
                                    <td>{result.mii_short_name}</td>
                                    <td>{result.sebi_regisn_no}</td>
                                    <td hidden>{result.mii_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

               
            </div>
            <button className="btn btn-secondary close_btn" onClick={onClose}>Close</button>
        </div>
    );
}

export default EditPopup;
