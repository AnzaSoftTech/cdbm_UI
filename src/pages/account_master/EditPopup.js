import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PopupCss.css'; // Adjust the path as per your file structure
import { BASE_URL } from ".././constants";

function EditPopup({ onClose ,onRowSelect }) {

    const [searchResults, setSearchResults] = useState([]);
    const [searchAcctName, setSearchAcctName] = useState('');
    const [groupCodes, setGroupCodes] = useState([]);
    const [groupCode, setGroupCode] = useState();


    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_fin_group_level2`)
            .then(response => setGroupCodes(response.data))
            .catch(error => console.error('Error fetching exchanges:', error));
    }, []);


    const handleSearch = async () => {

        try {
            console.log('groupCode ', groupCode);
            const response = await axios.get(`${BASE_URL}/api/search_account_master`, {
                params: {
                    p_account_name: searchAcctName || '',
                    p_group_code: groupCode,
                    // p_bank_name: searchBankName || '', 
                    // p_acct_no: searchAccountNo || ''
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
        console.log('Sending Selected Row:', selectedRow);
    
        try {
            const response = await axios.get(`${BASE_URL}/api/search_Acc_Master_ById`, {
                params: {
                    p_act_cd:selectedRow.act_cd || '',
                }
            });

            //console.log('API response data:', response.data);
            // Pass the selected row to the main component
            onRowSelect(response.data);
            console.log('response.data>>>>>>>',response.data);
    
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };
    

    return (
        <div className="popup">
            <div className="popup-inner">
                <h4 className='header_color_search'>Edit Account Master</h4>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex ">
                        <label style={{ width: '150px', marginLeft: '8px' }} >Account Name</label>
                        <input type="text" className="form-control me-1 mb-3" value={searchAcctName}
                            onChange={(e) => setSearchAcctName(e.target.value)} size="sm" />
                    </div>
                    
                </div>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex ">
                        <label htmlFor="groupCode" style={{ width: '100px', marginLeft: '8px' }}>Group</label>
                        <select id="groupCode" className="form-control me-1 mb-3" style={{width: '232px', height: '40px'}}  name='groupCode'
                            value={groupCode} onChange={(e) => setGroupCode(e.target.value)}>
                            <option value="">Select Group</option>
                            {groupCodes.map(Grp => (
                                <option key={Grp.grp_cd_lvl2} value={Grp.grp_cd_lvl2}>{Grp.grp_desc}</option>
                            ))}
                        </select>
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button style={{ width: '150px', height: '40px' }} className="btn btn-primary me-3 btn-sm"
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
                                <th hidden>act_cd</th>
                                <th>Account Name</th>
                                <th>Account Status</th>
                                <th>Ledger Type</th>
                                {/* <th>Bank Name</th> */}
                                {/* <th >Account Number</th> */}
                            </tr>

                        </thead>
                        <tbody>
                            {searchResults.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td hidden>{result.act_cd}</td>
                                    <td>{result.account_name}</td>
                                    <td>{result.status}</td>
                                    <td>{result.ledg_type}</td>
                                    {/* <td>{result.bank_name}</td> */}
                                    {/* <td>{result.acct_no}</td> */}
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
