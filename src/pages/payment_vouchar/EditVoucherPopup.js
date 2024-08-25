import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditVoucherPopup.css'; // Import the updated CSS file

function EditVoucherPopup({ onClose, onRowSelect }) {
    const [branchNamecd, setBranchName] = useState('');
    const [voucherNo, setVoucherNo] = useState('');
    const [accountNamecd, setAccountName] = useState('');
    const [accountNames, setAccountNames] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [bookTypes, setBookTypes] = useState([]);
    const [bookType, setBookType] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/bookType')
            .then(response => setBookTypes(response.data))
            .catch(error => console.error('Error fetching book types:', error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/api/Account')
            .then(response => setAccountNames(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/api/branches')
            .then(response => setBranches(response.data))
            .catch(error => console.error('Error fetching branches:', error));
    }, []);

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/searchVouchers', {
                params: {
                    branchNamecd,
                    voucherNo,
                    accountNamecd,
                    fromDate,
                    toDate,
                    bookType
                }
            });
            setSearchResults(response.data);
            console.log('edit voucher', response.data);
            
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };

    return (
        <div className="voucherPopup">
            <div className="voucherPopup-inner">
                <h4 className='header_color'>Edit Voucher</h4>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex">
                        <label className='branch_width'>Branch Name:</label>
                        <select
                            className="form-control mb-3 branch_input"
                            value={branchNamecd}
                            onChange={(e) => setBranchName(e.target.value)}
                            size="sm"
                        >
                            <option value="">Select Branch</option>
                            {branches.map(branch => (
                                <option key={branch.branch_cd} value={branch.branch_cd}>{branch.branch_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group d-flex">
                        <label className='voucher_width'>Voucher No:</label>
                        <input
                            type="text"
                            className="form-control me-1 height_voucher_input mb-3"
                            value={voucherNo}
                            onChange={(e) => setVoucherNo(e.target.value)}
                            size="sm"
                        />
                    </div>
                </div>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex">
                        <label className='formDt_width'>From Date:</label>
                        <input
                            type="date"
                            className="form-control form_dt_input mb-3"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            size="sm"
                        />
                        <label className='todate_width'>To Date:</label>
                        <input
                            type="date"
                            className="form-control mb-3 todt_input"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            size="sm"
                        />
                    </div>

                    <div className="form-group d-flex">
                        <label className='booktype_label'>Book Type:</label>
                        <select
                            id="bookType"
                            className="form-select booktype_input me-1"
                            name='bookType'
                            value={bookType}
                            onChange={(e) => setBookType(e.target.value)}
                        >
                            <option value="">Select Book Type</option>
                            {bookTypes.map(BookTypes => (
                                <option key={BookTypes.book_type} value={BookTypes.book_type}>{BookTypes.book_type}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex">
                        <label className='accountName_width'>Account Name:</label>
                        <select
                            className="form-control accountName_input mb-3"
                            value={accountNamecd}
                            onChange={(e) => setAccountName(e.target.value)}
                            size="sm"
                        >
                            <option value="">Select Account</option>
                            {accountNames.map(AccountName => (
                                <option key={AccountName.act_cd} value={AccountName.act_cd}>{AccountName.act_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button className="btn btn-primary me-3 btn-sm btn_height" onClick={handleSearch}>Search</button>
                    </div>
                </div>
                <div className='table-container'>
                    <table className="table mt-3 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                                <th>Fin year</th>
                                <th>Voucher No</th>
                                <th>Book Type</th>
                                <th>Trans_Date</th>
                                <th>Effective_Date</th>
                                <th>Account Name</th>
                                <th>Amount</th>
                                <th>Dr/Cr</th>
                                <th>Segment</th>
                                <th>Exchange</th>
                                <th>Branch</th>
                                <th>Company</th>
                                <th>Normal/Depositor</th>
                                <th>Account Code</th>
                                <th>Narration</th>
                                <th>analyzer_code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map((result, index) => (
                                <tr
                                    key={index}
                                    onClick={() => onRowSelect(result.fin_year, result.voucher_no, result.book_type, result.trans_date, result.eff_date, result.cb_act_cd, result.amount, result.drcr, result.segment, result.exc_cd, result.branch_cd, result.cmp_cd, result.nor_depos, result.act_cd, result.narration, result.narr_code)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{result.fin_year}</td>
                                    <td>{result.voucher_no}</td>
                                    <td>{result.book_type}</td>
                                    <td>{new Date(result.trans_date).toLocaleDateString()}</td>
                                    <td>{new Date(result.eff_date).toLocaleDateString()}</td>
                                    <td>{result.cb_act_cd}</td>
                                    <td>{result.amount}</td>
                                    <td>{result.drcr}</td>
                                    <td>{result.segment}</td>
                                    <td>{result.exc_cd}</td>
                                    <td>{result.branch_cd}</td>
                                    <td>{result.cmp_cd}</td>
                                    <td>{result.nor_depos}</td>
                                    <td>{result.act_cd}</td>
                                    <td>{result.narration}</td>
                                    <td>{result.narr_code}</td>
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

export default EditVoucherPopup;
