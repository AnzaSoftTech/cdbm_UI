import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditVoucherPopup.css'; // Import the updated CSS file
import { BASE_URL } from "../constants";

function EditVoucherPopup({ onClose, onRowSelect }) {
    const [branchNamecd, setBranchName] = useState('');
    const [voucherNo, setVoucherNo] = useState('');
    //const [accountNamecd, setAccountName] = useState('');
    //const [accountNames, setAccountNames] = useState([]);
    const [accountName, setAccountName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [bookTypes, setBookTypes] = useState([]);
    const [bookType, setBookType] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [branches, setBranches] = useState([]);
    const [TransactionType, setTransactionType] = useState('Payment');
    

    useEffect(() => {
        axios.get(`${BASE_URL}/api/bookType`)
            .then(response => setBookTypes(response.data))
            .catch(error => console.error('Error fetching book types:', error));
    }, []);

  

    // useEffect(() => {
    //     axios.get('http://localhost:3001/api/Account')
    //         .then(response => setAccountNames(response.data))
    //         .catch(error => console.error('Error fetching accounts:', error));
    // }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/branches`)
            .then(response => setBranches(response.data))
            .catch(error => console.error('Error fetching branches:', error));
    }, []);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/searchVouchers`, {
                params: {
                    //branchNamecd: branchNamecd || '', 
                    TransactionType:TransactionType ||'',
                    accountName: accountName || '', 
                    fromDate: fromDate || '', 
                    toDate: toDate || '', 
                    bookType: bookType || ''
                }
            });
            setSearchResults(response.data);
            console.log('edit voucher', response.data);
            
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };

    const handleSendData = async(selectedRow) => {
        console.log('Sending Selected Row:', selectedRow);
    
        try {
            const response = await axios.get(`${BASE_URL}/api/searchVoucharById`, {
                params: {
                    //segment:selectedRow.segment || '',
                    // exchange:selectedRow.exc_cd || '',
                    // nor_depos:selectedRow.nor_depos || '',
                    //cmp_cd:selectedRow.cmp_cd || '',
                    //branchNamecd: selectedRow.branch_cd || '', 
                    fin_year:selectedRow.fin_year || '',
                    voucherNo: selectedRow.voucher_no || '', 
                    bookType: selectedRow.book_type || '' ,
                    tranType: selectedRow.trans_type || '' ,
                    //act_cd:selectedRow.act_cd || ''
                }
            });
    
            
            console.log('API response data:', response.data);
    
            // Pass the selected row to the main component
            onRowSelect(response.data);
    
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };
    

    return (
        <div className="voucherPopup">
    <div className="voucherPopup-inner">
        <h4 className='header_color'>Edit Voucher</h4>
        <div className='d-flex flex-wrap justify-content-between'>
            <div className="form-group">
                <label className='label-prop'>From/To Date:</label>
                <input
                    type="date"
                    className="form-control input_date_prop"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />
                <input
                    type="date"
                    className="form-control input_date_prop"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label className='label-prop margin_prop5'>Book Type:</label>
                <select
                    className="form-select ddl_prop"
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
        <div className='d-flex flex-wrap justify-content-between'>
            <div className="form-group">
                <label className='label-prop'>Account Name:</label>
                <input 
                    type="text" 
                    className="form-control input_prop" 
                    value={accountName}  
                    onChange={(e) => setAccountName(e.target.value)} 
                    
                />
            </div>
            <div className="form-group">
                <label className='label-prop '>Transaction Type:</label>
                <select className="form-control input_prop " value={TransactionType} onChange={(e) => setTransactionType(e.target.value)}>
                    <option value="Payment">Payment</option>
                    <option value="Receipt">Receipt</option>
                </select>
                <button className="btn btn-primary btn_height" onClick={handleSearch}>Search</button>
            </div>
        </div>
        <div className='table-container-search'>
                    <table className="table mt-0 table-wrapper">
                        <thead className='table-primary'>
                            <tr>
                            <th hidden>Fin year</th>
                                <th>Voucher No</th>
                                <th>Book Type</th>
                                <th >Trans_Date</th>
                                <th hidden>Effective_Date</th>
                                <th>Account Name</th>
                                <th>Amount</th>
                                <th>Dr/Cr</th>
                                <th hidden>Segment</th>
                                {/* <th hidden>Exchange</th>
                                <th hidden>Branch</th>
                                <th hidden>Company</th> */}
                                <th hidden>Normal/Depositor</th>
                                <th hidden>Account Code</th>
                                <th hidden>Narration</th>
                                <th hidden>analyzer_code</th>
                                <th hidden>Transaction Type</th>
                            </tr>
                        </thead>
                        <tbody className='tab_row_search'>
                            {searchResults.map((result, index) => (
                                <tr key={index} onClick={() => handleSendData(result)} style={{ cursor: 'pointer' }}>
                                    <td hidden>{result.fin_year}</td>
                                    <td>{result.voucher_no}</td>
                                    <td>{result.book_type}</td>
                                    <td>{new Date(result.trans_date).toLocaleDateString()}</td>
                                    <td hidden>{new Date(result.eff_date).toLocaleDateString()}</td>
                                    <td>{result.act_name}</td>
                                    
                                    <td>{result.amount}</td>
                                    <td>{result.drcr}</td>
                                    <td hidden>{result.segment}</td>
                                    {/* <td hidden>{result.exc_cd}</td>
                                    <td hidden>{result.branch_cd}</td>
                                    <td hidden>{result.cmp_cd}</td> */}
                                    <td hidden>{result.nor_depos}</td>
                                    <td hidden>{result.act_cd}</td>
                                    <td hidden>{result.narration}</td>
                                    <td hidden>{result.narr_code}</td>
                                    <td hidden>{result.trans_type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        <button className="btn-warning close_btn-2" onClick={onClose}>Close</button>
    </div>
</div>

    );
}

export default EditVoucherPopup;
