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
    // Dropdown options (you can fetch these dynamically if needed)

    useEffect(() => {
        axios.get(`${BASE_URL}/api/bookType`)
            .then(response => {setBookTypes(response.data)})
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/Account`)
            .then(response => setAccountNames(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);
    useEffect(() => {
        axios.get(`${BASE_URL}/api/branches`)
            .then(response => {
                setBranches(response.data);
                // alert(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    },
        []);


    const handleSearch = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/searchContraEntry`, {
                params: {
                    accountName,
                    fromDate,
                    toDate,
                    bookType,
                    tran_type : 'Contra',
                }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };

    const handleSendData = async (selectedRow) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/searchEditContra`, {
                params: {
                    segment: selectedRow.segment || '',
                    exchange: selectedRow.exc_cd || '',
                    activity: selectedRow.cmp_cd || '',
                    fin_year: selectedRow.fin_year || '',
                    voucherNo: selectedRow.voucher_no || '',
                    bookType: selectedRow.book_type || '',
                }
            });

            // Pass the selected row to the main component
            onRowSelect(response.data);
            onClose();

        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };


    return (
        <div className="popup">
            <div className="popup-inner">
                <h5 className='header_color'>Edit Voucher</h5>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex" style={{ marginLeft: '10px' }}>
                        <label className='form-label' style={{ width: '150px' }}>From Date:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            size="sm"
                        />
                    </div>
                    <div className="form-group d-flex">
                        <label className='form-label' style={{ width: '150px' }}>To Date:</label>
                        <input
                            type="date"
                            className="form-control"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            size="sm"
                        />
                    </div>
                </div>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex" style={{ marginLeft: '10px' }}>
                        <select
                            id="bookType"
                            className="form-control"
                            name='bookType'
                            value={bookType}
                            style={{ width: '287px' }}
                            onChange={(e) => setBookType(e.target.value)}
                        >
                            <option value="">Select Book Type</option>
                            {bookTypes.map(BookTypes => (
                                <option key={BookTypes.book_type} value={BookTypes.book_type}>{BookTypes.book_type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group d-flex">
                        <input
                            type="text"
                            className="form-control"
                            value={accountName}
                            style={{ width: '287px' }}
                            placeholder='Enter Cash/Bank Name'
                            onChange={(e) => setAccountName(e.target.value)}
                            size="sm"
                        />
                    </div>
                </div>
                <div className='d-flex justify-content-between' style={{ float: 'right', marginBottom: '20px' }}>
                    <div className='d-flex justify-content-end'>
                        <button className="btn btn-primary me-3 btn-sm btn_height" onClick={handleSearch} >Search</button>
                        <button
                            className="btn btn-primary me-3 btn-sm btn_height"
                            style={{ backgroundColor: '#DC3545' }}
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
                <div className=' table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th hidden>Fin year</th>
                                <th>Voucher No</th>
                                <th>Book Type</th>
                                <th >Trans_Date</th>
                                <th>Cash/Bank Name</th>
                                <th>Amount</th>
                                <th>Dr/Cr</th>
                                <th hidden>Segment</th>
                                <th hidden>Exchange</th>
                                <th hidden>Branch</th>
                                <th hidden>drcr</th>
                                <th hidden>cb_act_cd</th>
                                <th hidden>Narration</th>
                                <th hidden>analyzer_code</th>
                                <th hidden>Effective_Date</th>
                                <th hidden>eff_date</th>
                            </tr>

                        </thead>
                        <tbody>
                            {searchResults.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td hidden>{result.fin_year}</td>
                                    <td>{result.voucher_no}</td>
                                    <td>{result.book_type}</td>
                                    <td>{new Date(result.trans_date).toLocaleDateString()}</td>
                                    <td>{result.account_title}</td>
                                    <td>{result.amount}</td>
                                    <td>{result.drcr}</td>
                                    <td hidden>{result.segment}</td>
                                    <td hidden>{result.exc_cd}</td>
                                    <td hidden>{result.branch_cd}</td>
                                    <td hidden>{result.drcr}</td>
                                    <td hidden>{result.cb_act_cd}</td>
                                    <td hidden>{result.narration}</td>
                                    <td hidden>{result.narr_code}</td>
                                    <td hidden>{new Date(result.eff_date).toLocaleDateString()}</td>
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
