import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditSettleJvPopup.css'; // Adjust the path as per your file structure
import { BASE_URL } from "../constants";

function EditSettleJvPopup({ onClose, onRowSelect }) {
    const [accountName, setAccountName] = useState('');
    // const [accountNames, setAccountNames] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [bookTypes, setBookTypes] = useState([]);
    const [bookType, setBookType] = useState('');
    const [searchResults, setSearchResults] = useState([]);


    // Dropdown options (you can fetch these dynamically if needed)

    useEffect(() => {
        axios.get(`${BASE_URL}/api/bookType`)
            .then(response => setBookTypes(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);


    const handleSearch = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/searchJv`, {
                params: {
                    accountName: accountName || null,
                    fromDate,
                    toDate,
                    bookType: bookType || null,
                    tran_type: 'SETTLEMENT',
                }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching vouchers:', error);
        }
    };
    // console.log('result----', searchResults)
    // const handleSendData = () => {
    //     onRowSelect(searchResults); // Send all rows to the main component
    //     // Log the data being sent
    // };
    const handleSendData = async (selectedRow) => {
        console.log('Sending Selected Row:', selectedRow);

        try {
            const response = await axios.get(`${BASE_URL}/api/searchEditVouchar`, {
                params: {
                    segment: selectedRow.segment || '',
                    exchange: selectedRow.exc_cd || '',
                    nor_depos: selectedRow.nor_depos || '',
                    fin_year: selectedRow.fin_year || '',
                    voucherNo: selectedRow.voucher_no || '',
                    bookType: selectedRow.book_type || '',
                    act_cd: selectedRow.act_cd || '',
                    activityCode: selectedRow.cmp_cd || ''
                }
            });


           // console.log('API response data:', response.data);

            // Pass the selected row to the main component
            //console.log('response.data => ', response.data);
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
                <div className='d-flex justify-content-between' style={{float:'right', marginBottom: '20px'}}>
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
                <div className='d-flex justify-content-between' style={{ float: 'right', marginBottom: '20px' }}>

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
                                <th hidden>activity_cd</th>



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
                                    <td>{result.account_name}</td>

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

export default EditSettleJvPopup;
