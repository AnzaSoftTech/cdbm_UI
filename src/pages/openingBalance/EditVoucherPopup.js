import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditVoucherPopup.css'; // Adjust the path as per your file structure
import { BASE_URL } from "../constants";


function EditVoucherPopup({ onClose, onRowSelect }) {
    const [branchNamecd, setBranchName] = useState('');
    const [voucherNo, setVoucherNo] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountNames, setAccountNames] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [bookTypes, setBookTypes] = useState([]);
    const [bookType, setBookType] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [branches, setBranches] = useState([]);
    const [finYear, setFinYear] = useState();
    const [accountType, setAccountType] = useState('account');
    // Dropdown options (you can fetch these dynamically if needed)

    useEffect(() => {
        axios.get(`${BASE_URL}/api/get_fin_year`)
            .then(response => setFinYear(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    const handleSearch = async () => {
        try {
            if(!finYear){
                alert('Please Enter Fin Year');
                return;
            }
            const response = await axios.get(`${BASE_URL}/api/searchOpenBal`, {
                params: {
                    finYear,
                    accountType,
                    accountName,
                }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };

    const handleSendData = (result) => {
        onRowSelect(result);
        onClose();
    }


    return (
        <div className="popup">
            <div className="popup-inner">
                <h5 className='header_color'>Edit Openinig Balance</h5>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex" style={{ marginLeft: '10px' }}>
                        <label className='form-label' style={{ width: '110px' }}>Fin Year:</label>
                        <input id="finYear" className="form-control" style={{ marginRight: '0.625rem', width: '227px' }}
                            value={finYear} onChange={(e) => setFinYear(e.target.value)} />
                    </div>
                </div>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex " style={{ marginLeft: '10px' }}>
                        <label className='form-label' style={{width: '110px'}}>Account Type:</label>
                        <select
                            value={accountType}
                            onChange={e => setAccountType(e.target.value)}
                            style={{width: '227px', height: '40px'}}
                            className="form-control"
                        >
                            <option value="account">Account</option>
                            <option value="cb_account">Cash/Bank</option>
                        </select>
                    </div>
                    <div className="form-group d-flex" style={{ marginLeft: '10px' }}>
                        {/* <label className='form-label' style={{ width: '110px' }}>Account Name:</label> */}
                        <input id="accountName" className="form-control" style={{ marginRight: '0.625rem', width: '287px' }}
                            value={accountName} onChange={(e) => setAccountName(e.target.value)} 
                            placeholder='Enter Account Name/ Cash/Bank Name' />
                    </div>
                </div>
                <div className='d-flex justify-content-end' style={{ float: 'right', marginBottom: '20px', marginTop: '10px' }}>
                    <button className="btn btn-primary me-3 btn-sm btn_height" onClick={handleSearch}>Search</button>
                    <button className="btn btn-primary me-3 btn-sm btn_height" onClick={onClose}
                        style={{ backgroundColor: '#dc3545' }}>Close</button>
                </div>
                <div className=' table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Fin year</th>
                                <th>Account Name</th>
                                <th>Opening Balance</th>
                                <th>Dr/Cr</th>
                                <th>As on Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td>{result.fin_year}</td>
                                    <td>{result.account_name}</td>
                                    <td>{result.open_bal_amt}</td>
                                    <td>{result.drcr}</td>
                                    <td>{result.bal_as_on_date}</td>
                                    <td hidden>{result.act_cd ? result.act_cd : result.cb_act_cd}</td>
                                    <td hidden>{result.exc_cd}</td>
                                    <td hidden>{result.segment}</td>
                                    <td hidden>{result.activity_cd}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </div>
            
        </div>
    );
}

export default EditVoucherPopup;
