import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PopupCss.css'; // Adjust the path as per your file structure
import { BASE_URL } from ".././constants";

function EditPopup({ onClose ,onRowSelect }) {
    const [branchNamecd, setBranchName] = useState('');
    const [voucherNo, setVoucherNo] = useState('');
    const [accountName, setAccountName] = useState('');
    // const [accountNames, setAccountNames] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [bookTypes, setBookTypes] = useState([]);
    const [bookType, setBookType] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [branches, setBranches] = useState([]);

    const [searchActTitle, setSearchAcctTitle] = useState('');
    const [searchBankName, setSearchBankName] = useState('');
    const [searchAccountNo, setSearchAccountNo] = useState('');
    
    // Dropdown options (you can fetch these dynamically if needed)

    // useEffect(() => {
    //     axios.get('http://localhost:3001/api/bookType')
    //         .then(response => setBookTypes(response.data))
    //         .catch(error => console.error('Error fetching accounts:', error));
    // }, []);

    // useEffect(() => {
    //     axios.get('http://localhost:3001/api/Account')
    //         .then(response => setAccountNames(response.data))
    //         .catch(error => console.error('Error fetching accounts:', error));
    // }, []);
    // useEffect(() => {
    //     axios.get('http://localhost:3001/api/branches')
    //         .then(response => {
    //             setBranches(response.data);
    //             // alert(response.data);
    //         })
    //         .catch(error => {
    //             console.error("There was an error fetching the data!", error);
    //         });
    // },
    //     []);


    const handleSearch = async () => {

        try {
            const response = await axios.get(`${BASE_URL}/api/search_Cash_Bank_Master`, {
                params: {
                    p_acct_title: searchActTitle || '', 
                    p_bank_name: searchBankName || '', 
                    p_acct_no: searchAccountNo || ''
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
            const response = await axios.get(`${BASE_URL}/api/search_CashBank_Master_ById`, {
                params: {
                    p_cb_act_cd:selectedRow.cb_act_cd || ''
                }
            });

            //console.log('API response data:', response.data);
            // Pass the selected row to the main component
            onRowSelect(response.data);
            console.log('response.data',response.data);
    
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };
    

    return (
        <div className="popup">
            <div className="popup-inner">
                <h4 className='header_color_search'>Edit Cash/Bank Master</h4>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex ">
                        <label style={{width:'150px', marginLeft:'8px'}} >Account Title</label>
                            <input type="text" className="form-control me-1 mb-3" value={searchActTitle} 
                             onChange={(e) => setSearchAcctTitle(e.target.value)} size="sm" />
                    </div>
                    <div className="form-group d-flex">
                        <label style={{width:'150px', marginLeft:'8px'}} >Bank Name</label>
                        <input type="text" className="form-control me-1 height_search_input mb-3" value={searchBankName}
                         onChange={(e) => setSearchBankName(e.target.value)} size="sm" />
                    </div>
                </div>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex">
                        <label style={{width:'150px', marginLeft:'8px'}}>Account No:</label>
                        <input type="text" className="form-control accountName_input mb-3" value={searchAccountNo} 
                         onChange={(e) => setSearchAccountNo(e.target.value)} size="sm" />
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button style={{width:'150px', height:'40px'}} className="btn btn-primary me-3 btn-sm"
                         onClick={handleSearch} >Search</button>
                    </div>

                </div>
                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Account Title</th>
                                <th>Bank Name</th>
                                <th >Account Number</th>
                                <th hidden>cb_act_cd</th>
                            </tr>

                        </thead>
                        <tbody>
                            {searchResults.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.acct_title}</td>
                                    <td>{result.bank_name}</td>
                                    <td>{result.acct_no}</td>
                                    <td hidden>{result.cb_act_cd}</td>
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
