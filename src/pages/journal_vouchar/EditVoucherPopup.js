import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditVoucherPopup.css'; // Adjust the path as per your file structure

function EditVoucherPopup({ onClose ,onRowSelect }) {
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
    
    // Dropdown options (you can fetch these dynamically if needed)

    useEffect(() => {
        axios.get('http://localhost:3001/api/bookType')
            .then(response => setBookTypes(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    // useEffect(() => {
    //     axios.get('http://localhost:3001/api/Account')
    //         .then(response => setAccountNames(response.data))
    //         .catch(error => console.error('Error fetching accounts:', error));
    // }, []);
    useEffect(() => {
        axios.get('http://localhost:3001/api/branches')
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
        if (!fromDate || !toDate) {
            alert('Please enter Voucher Date and Effective Date.');
            return;
        }
        if (!bookType) {
            alert('Please Select Book Type.');
            return;
        }
        if (!branchNamecd) {
            alert('Please Select Branch Name.');
            return;
        }
        if (!accountName) {
            alert('Please Select Account Name.');
            return;
        }
        if (!voucherNo) {
            alert('Please Select Voucher No.');
            return;
        }
        try {
            const response = await axios.get('http://localhost:3001/api/searchVouchers', {
                params: {
                    branchNamecd: branchNamecd || '', 
                    voucherNo: voucherNo || '', 
                    accountName: accountName || '', 
                    fromDate: fromDate || '', 
                    toDate: toDate || '', 
                    bookType: bookType || '' 
                }
            });
            setSearchResults(response.data);
            console.log('hiii---',response.data)
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };
    console.log('result----',searchResults)
    // const handleSendData = () => {
    //     onRowSelect(searchResults); // Send all rows to the main component
    //     // Log the data being sent
    // };
    const handleSendData = async(selectedRow) => {
        console.log('Sending Selected Row:', selectedRow);
    
        try {
            const response = await axios.get('http://localhost:3001/api/searchEditVouchar', {
                params: {
                    segment:selectedRow.segment || '',
                    exchange:selectedRow.exc_cd || '',
                    nor_depos:selectedRow.nor_depos || '',
                    fin_year:selectedRow.fin_year || '',
                    cmp_cd:selectedRow.cmp_cd || '',
                    branchNamecd: selectedRow.branch_cd || '', 
                    voucherNo: selectedRow.voucher_no || '', 
                    bookType: selectedRow.book_type || '' ,
                    act_cd:selectedRow.act_cd || ''
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
        <div className="popup">
            <div className="popup-inner">
                <h4 className='header_color'>Edit Voucher</h4>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex ">
                        <label className='branch_width'>Branch Name:</label>
                        <select
                            className="form-control mb-3  branch_input"
                            value={branchNamecd}
                            onChange={(e) => setBranchName(e.target.value)}
                            size="sm"
                        >
                            <option value="">Select Branch</option>
                            {branches.map(branch => (<option key={branch.branch_cd} value={branch.branch_cd}>{branch.branch_name}</option>))}
                        </select>
                    </div>
                    <div className="form-group d-flex">
                        <label className='vouchar_width'>Voucher No:</label>
                        <input type="number" className="form-control me-1 height_vouchar_input mb-3" value={voucherNo} onChange={(e) => setVoucherNo(e.target.value)} size="sm" />
                    </div>
                </div>
                <div className='d-flex justify-content-between'>
                    <div className="form-group d-flex">
                        <label className='formDt_width'>From Date:</label>
                        <input type="date" className="form-control form_dt_input mb-3" value={fromDate} onChange={(e) => setFromDate(e.target.value)} size="sm" />
                        <label className='todate_width'>To Date:</label>
                        <input type="date" className="form-control   mb-3 todt_input" value={toDate} onChange={(e) => setToDate(e.target.value)} size="sm" />
                    </div>

                    <div className="form-group d-flex">
                        <label className='booktype_label'>Book Type:</label>

                        <select id="bookType" className="form-select   booktype_input me-1" name='bookType' value={bookType} onChange={(e) => setBookType(e.target.value)}>
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
                        <input type="text" className="form-control accountName_input mb-3" value={accountName}  onChange={(e) => setAccountName(e.target.value)} size="sm" />
                        {/* <select
                            className="form-control accountName_input mb-3"
                            value={accountNamecd}
                            onChange={(e) => setAccountName(e.target.value)}
                            size="sm"
                        >
                            <option value="">Select Account</option>
                            {accountNames.map(AccountName => (
                                <option key={AccountName.act_cd} value={AccountName.act_cd}>{AccountName.act_name}</option>
                            ))}
                        </select> */}
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button className="btn btn-primary me-3 btn-sm btn_height" onClick={handleSearch} >Search</button>
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
                                <th hidden>Effective_Date</th>
                                <th>Account Name</th>
                                
                                <th>Amount</th>
                                <th>Dr/Cr</th>
                                <th hidden>Segment</th>
                                <th hidden>Exchange</th>
                                <th hidden>Branch</th>
                                <th hidden>Company</th>
                                <th hidden>Normal/Depositor</th>
                                <th hidden>Account Code</th>
                                <th hidden>Narration</th>
                                <th hidden>analyzer_code</th>



                            </tr>

                        </thead>
                        <tbody>
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
                                    <td hidden>{result.exc_cd}</td>
                                    <td hidden>{result.branch_cd}</td>
                                    <td hidden>{result.cmp_cd}</td>
                                    <td hidden>{result.nor_depos}</td>
                                    <td hidden>{result.act_cd}</td>
                                    <td hidden>{result.narration}</td>
                                    <td hidden>{result.narr_code}</td>
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
