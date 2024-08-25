// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable, { Alignment } from 'react-data-table-component';
import { Modal, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import './journal.css'; // Import custom styles
import axios from 'axios';
import PopupSearch from './popsearch';
import EditVoucherPopup from './EditVoucherPopup.js';

function Open_Balance({ details, setDetails }) {
    const [bookType, setBookType] = useState('');
    const [branchCode, setBranchCode] = useState('');
    
    const [showPopup, setShowPopup] = useState(false);
    const [branchCodes, setBranchCodes] = useState([]);
    const [segment, setSegment] = useState();
    const [normalDeposit, setNormalDeposit] = useState();
    const [exchangeCode, setExchangeCode] = useState();
        
    const [finYear, setFinYear] = useState();
    

    const [exchanges, setExchanges] = useState([]);
    const [voucherDate, setVoucherDate] = useState('');
    const [voucherNo, setVoucherNo] = useState('');
    const [asonDate, setAsOnDate] = useState('');
    const [narration, setNarration] = useState('');
    const [totals, setTotals] = useState({ drTotal: 0, crTotal: 0, balance: 0 });
    const [showModal, setShowModal] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [drCrType, setDrCrType] = useState('');
    const [header, setHeader] = useState({});

    const [userId, setUserId] = useState(1);

    useEffect(() => {
        axios.get('http://localhost:3001/api/branches')
            .then(response => setBranchCodes(response.data))
            .catch(error => console.error('Error fetching Branches:', error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/exchange')
            .then(response => setExchanges(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/api/getcurrfinyear')
            .then(response => setFinYear(response.data[0].fin_year))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useState(() => {
        if (details.length === 0) {
            setDetails([{ act_cd: '', act_name: '', open_bal_amt: '', dr_cr: '' }]);
        }
    });

    const handleAddRow = () => {
        setDetails([...details, { act_cd: '', act_name: '', open_bal_amt: '', dr_cr: '' }]);
    };

    const handleEditClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleDeleteRow = (index) => {
        const deletedRow = details[index];
        setDetails(details.filter((_, i) => i !== index));

    };

    const handleSearchClick = (index) => {
        
        if (!branchCode) {
            alert('Please select Branch.');
            return;
        }

        if (!segment) {
            alert('Please select Segment.');
            return;
        }

        if (!normalDeposit) {
            alert('Please select Normal/Deposit.');
            return;
        }

        if (!exchangeCode) {
            alert('Please select Exchange.');
            return;
        }

        setSelectedRowIndex(index);
        setShowModal(true);
    };

    // const handleVoucharRowSelect = (fin_year, voucher_no, book_type, trans_date, eff_date, cb_act_cd, open_bal_amt, drcr, segment, exc_cd, branch_cd, cmp_cd, nor_depos, act_cd, narration, narr_code) => {
    //     setBookType(book_type);
    //     setAsOnDate(eff_date);
    //     setVoucherDate(trans_date);
    //     setVoucherNo(voucher_no);
    //     const newDetails = [...details];
    //     const selectedRow = newDetails[selectedRowIndex];

    //     selectedRow.segment = segment;
    //     selectedRow.exchange = exc_cd;
    //     selectedRow.noraml_deposit = nor_depos;
    //     selectedRow.act_name = cb_act_cd;
    //     selectedRow.dr_cr = drcr;
    //     if (drcr === 'Dr') {
    //         selectedRow.dr_amount = open_bal_amt;
    //         selectedRow.cr_amount = '';
    //     } else {
    //         selectedRow.cr_amount = open_bal_amt;
    //         selectedRow.dr_amount = '';
    //     }
    //     selectedRow.narration = narration;
    //     selectedRow.analyzer_code = narr_code;

    //     setDetails(newDetails);
    //     // console.log('segment',segment);
    //     // console.log('exc_cd',exc_cd);
    //     // console.log('nor_depos',nor_depos);
    //     // console.log('cb_act_cd',cb_act_cd);
    //     // console.log('drcr',drcr);
    //     // console.log('drcr',amount);
    //     // console.log('drcr',narration);
    //     // console.log('drcr',narr_code)
    // };

    const handleSelectRow = (rowData) => {
        const { act_name, act_cd, branch_cd, cmp_cd, type_cd } = rowData;
        const newDetails = [...details];
        newDetails[selectedRowIndex].act_name = act_name;
        newDetails[selectedRowIndex].act_cd = act_cd;
        newDetails[selectedRowIndex].cmp_cd = cmp_cd;
        setDetails(newDetails);
        setShowModal(false);
    };

    const handleTypeChange = (index, type) => {
        const newDetails = [...details];
        newDetails[index].dr_cr = type;
        setDetails(newDetails);
        setDrCrType(type);
    };

    const handleFinalSave = () => {

        if (!branchCode) {
            alert('Please select Branch.');
            return;
        }

        if (!segment) {
            alert('Please select Segment.');
            return;
        }

        if (!normalDeposit) {
            alert('Please select Normal/Deposit.');
            return;
        }

        if (!exchangeCode) {
            alert('Please select Exchange.');
            return;
        }
        
        if (!asonDate) {
            alert('Please enter As on Date.');
            return;
        }

        setUserId(1);

        const headerData = {
            branchCode,
            segment,
            normalDeposit,
            exchangeCode,
            finYear,
            asonDate,
            userId,
        };
        setHeader(headerData);
        const data = {
            header: headerData,
            details: details,
        };
        alert(JSON.stringify(data));
        
        axios.post('http://localhost:3001/openbal', data)
                .then(response => {
                    alert('Opening Balances saved successfully!');
                    // Reset form state after successful save
                    setBookType('');
                    setVoucherDate('');
                    setAsOnDate('');
                    setNarration('');
                    setDetails([{ act_name: '', open_bal_amt: '', dr_cr: '', act_cd: '' }]);
                    //setTotals({ drTotal: 0, crTotal: 0, balance: 0 });
                })
                .catch(error => console.error('Error saving Opening Balance:', error));

    };

    const handleInputChange = (index, field, value) => {
        const newDetails = [...details];
        newDetails[index][field] = value;
        // if (value === '') {
        //     value = '0';
        // }
        // if (field === 'dr_amount' || field === 'cr_amount') {
        //     const drTotal = newDetails.reduce((sum, item) => item.dr_cr === 'Dr' ? sum + parseFloat(item.dr_amount || 0) : sum, 0);
        //     const crTotal = newDetails.reduce((sum, item) => item.dr_cr === 'Cr' ? sum + parseFloat(item.cr_amount || 0) : sum, 0);
        //     const balance = Math.abs(drTotal - crTotal);

        //     setTotals({ drTotal, crTotal, balance });
        // }
        setDetails(newDetails);
    };


    const columns = [
        {
            name: 'Sr No.',
            selector: (row, index) => index + 1,
            //sortable: true,
            width: '80px',
        },
        {
            name: 'Account Name',
            selector: 'act_name',
            //sortable: true,
            cell: (row, index) => (
                <div className='d-flex'>
                    <input
                        type="text"
                        value={row.act_name}
                        //onChange={e => handleInputChange(index, 'act_name', e.target.value)}
                        className="form-control" style={{width:'350px'}}
                    />
                    <Button
                        className='btn btn-primary'
                        variant="primary"
                        onClick={() => handleSearchClick(index)} //, row.exchange, row.segment
                        style={{ marginLeft: '10px', width: '100px', marginRight: '10px' }}

                    >
                        Search
                    </Button>
                    <Modal show={showModal} onHide={() => setShowModal(false)} className="custom-modal">
                        <Modal.Header style={{ backgroundColor: '#0275d8', color: 'white' }} closeButton>
                            <Modal.Title >Search and Select Account</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <PopupSearch onSelectRow={handleSelectRow} exchange={row.exchange} segment={row.segment} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>

            ),
            width: '490px',
        },
        {
            name: 'Dr/Cr',
            selector: (row, index) => (
                <select
                    value={row.dr_cr}
                    onChange={e => handleTypeChange(index, e.target.value)} // Note: Using index here
                    className="form-control" style={{marginLeft:'0px', width:'140px'}}>
                    <option value="">Select Dr/Cr</option>
                    <option value="Dr">Dr</option>
                    <option value="Cr">Cr</option>
                </select>
            ),
            width: '175px',
        },
        {
            name: 'Opening Balanace',
            select:row => row.open_bal_amt,
            cell : (row, index) => (
                // <input type="text" value={row.open_bal_amt} className="form-control"/>
                <input  type="number" value={row.open_bal_amt} className="form-control" 
                onChange={e => handleInputChange(index, 'open_bal_amt', e.target.value)}   />
            ),
            width: '200px',
        },

        {
            name: 'Actions',
            cell: (row, index) => (
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRow(index)}>Delete</button>
            ),
            allowOverflow: true,
            width: '100px',
        },
    ];
    return (
        <div className="container">
            <div className="card">
                <div className="card-header text-center color_header">
                    <h5>Opening Balance</h5>
                </div>
                <div className="card-body">
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="branchCode" className="form-label label-width">Branch Code</label>
                            <select id="branchCode" className="form-select  size_input" name='branchCode' value={branchCode} onChange={(e) => setBranchCode(e.target.value)}>
                                <option value=" ">Select Branch</option>
                                {branchCodes.map(Branches => (
                                    <option key={Branches.branch_cd} value={Branches.branch_cd}>{Branches.branch_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="finYear" className="form-label label-width input-smaller">Fin Year </label>
                            <input id="finYear" className="form-control size_input" value={finYear} readOnly />
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="segment" className="form-label label-width">Segment</label>
                            <select id="segment" className="form-select  size_input" name='segment' value={segment} onChange={(e) => setSegment(e.target.value)}>
                                <option value="">Select Segment</option>
                                <option value="C">Cash Market</option>
                            </select>
                            {/* <input id="voucherNo" type="number" className="form-control size_input " value={voucherNo} onChange={(e) => setVoucherNo(e.target.value)} readOnly /> */}
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="asonDate" className="form-label label-width input-smaller">As On Date </label>
                            <input id="asonDate" type="date" className="form-control size_input" value={asonDate} onChange={(e) => setAsOnDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                           <label htmlFor="normalDeposit" className="form-label label-width">Normal/Deposit</label>
                            <select id="normalDeposit" className="form-select  size_input" name='normalDeposit' value={normalDeposit} onChange={(e) => setNormalDeposit(e.target.value)} >
                                <option value="">Select Normal/Deposit</option>
                                <option value="N">Normal</option>
                                <option value="D">Deposit</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3 d-flex">
                           <label htmlFor="exchange" className="form-label input-smaller">Exchange</label>
                            <select id="exchangeCode" className="form-select size_input" name='exchangeCode' value={exchangeCode} onChange={(e) => setExchangeCode(e.target.value)}>
                            <option value="">Select Exchange</option>
                                 {exchanges.map(exchange => (
                                    <option key={exchange.exc_cd} value={exchange.exc_cd}>{exchange.exc_name}</option>
                                  ))}
                            </select>
                        </div>
                        
                    </div>
                    <div className="row ">
                       <div className="col-md-6 mb-3 d-flex  justify-content-end ">
                            <button className="btn  btn-primary me-2" onClick={handleEditClick}>Edit</button>
                            {showPopup && <EditVoucherPopup onClose={handleClosePopup}  />} 
                            {/* onRowSelect={handleVoucharRowSelect} */}
                            <button className="btn btn-success " onClick={handleFinalSave}>Save</button>
                        </div>

                    </div>
                    <div className="row ">
                        <div className="col">
                            <DataTable columns={columns} data={details} responsive />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mb-3 mt-3">
                        <button className="btn btn-success" onClick={handleAddRow}>Add</button>
                    </div>
                    {/* <div className='d-flex justify-content-around'>
                        <p>Total Dr: {totals.drTotal}</p>
                        <p>Total Cr: {totals.crTotal}</p>
                        <p>Balance: {totals.balance}</p>
                    </div> */}

                </div>
            </div>

        </div>
    );
};
export default Open_Balance;
