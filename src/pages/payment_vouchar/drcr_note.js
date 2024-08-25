// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { Modal, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import './journal.css'; // Import custom styles
import axios from 'axios';
import PopupSearch from './popsearch';
import EditVoucherPopup from './EditVoucherPopup.js';

function DrCr_Note({ details, setDetails }) {
    const [bookType, setBookType] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [bookTypes, setBookTypes] = useState([]);
    const [exchanges, setExchanges] = useState([]);
    const [voucherDate, setVoucherDate] = useState('');
    const [voucherNo, setVoucherNo] = useState('');
    const [effectiveDate, setEffectiveDate] = useState('');
    const [narration, setNarration] = useState('');
    const [totals, setTotals] = useState({ drTotal: 0, crTotal: 0, balance: 0 });
    const [showModal, setShowModal] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [drCrType, setDrCrType] = useState('');
    const [header, setHeader] = useState({});
    const [transType, setTransType] = useState('Dr Note');
    const [userId, setUserId] = useState(1);

    useEffect(() => {
        axios.get('http://localhost:3001/bookType')
            .then(response => setBookTypes(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/exchange')
            .then(response => setExchanges(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useState(() => {
        if (details.length === 0) {
            setDetails([{ act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', segment: '', exchange: '', noraml_deposit: '', narration: '', analyzer_code: '' }]);
        }
    });

    const handleAddRow = () => {
        setDetails([...details, { act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', segment: '', exchange: '', noraml_deposit: '', narration: '', analyzer_code: '' }]);
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

        // Recalculate totals after deleting row
        if (deletedRow.dr_cr === 'Dr') {
            const drTotal = totals.drTotal - parseFloat(deletedRow.dr_amount || 0);
            const balance = Math.abs(drTotal - totals.crTotal);
            setTotals({ ...totals, drTotal, balance });
        } else if (deletedRow.dr_cr === 'Cr') {
            const crTotal = totals.crTotal - parseFloat(deletedRow.cr_amount || 0);
            const balance = Math.abs(totals.drTotal - crTotal);
            setTotals({ ...totals, crTotal, balance });
        }
    };

    const handleInputChange = (index, field, value) => {
        const newDetails = [...details];
        newDetails[index][field] = value;
        if (value === '') {
            value = '0';
        }
        if (field === 'dr_amount' || field === 'cr_amount') {
            const drTotal = newDetails.reduce((sum, item) => item.dr_cr === 'Dr' ? sum + parseFloat(item.dr_amount || 0) : sum, 0);
            const crTotal = newDetails.reduce((sum, item) => item.dr_cr === 'Cr' ? sum + parseFloat(item.cr_amount || 0) : sum, 0);
            const balance = Math.abs(drTotal - crTotal);

            setTotals({ drTotal, crTotal, balance });
        }
        setDetails(newDetails);
    };

    const handleSearchClick = (index, exchange, segment) => {
        if (!exchange) {
            alert('Please select Exchange.');
            return;
        }
        if (!segment) {
            alert('Please select Segment.');
            return;
        }
        setSelectedRowIndex(index);
        setShowModal(true);
    };

    const handleVoucharRowSelect = (fin_year, voucher_no, book_type, trans_date, eff_date, cb_act_cd, amount, drcr, segment, exc_cd, branch_cd, cmp_cd, nor_depos, act_cd, narration, narr_code) => {
        setBookType(book_type);
        setEffectiveDate(eff_date);
        setVoucherDate(trans_date);
        setVoucherNo(voucher_no);
        const newDetails = [...details];
        const selectedRow = newDetails[selectedRowIndex];

        selectedRow.segment = segment;
        selectedRow.exchange = exc_cd;
        selectedRow.noraml_deposit = nor_depos;
        selectedRow.act_name = cb_act_cd;
        selectedRow.dr_cr = drcr;
        if (drcr === 'Dr') {
            selectedRow.dr_amount = amount;
            selectedRow.cr_amount = '';
        } else {
            selectedRow.cr_amount = amount;
            selectedRow.dr_amount = '';
        }
        selectedRow.narration = narration;
        selectedRow.analyzer_code = narr_code;

        setDetails(newDetails);
        // console.log('segment',segment);
        // console.log('exc_cd',exc_cd);
        // console.log('nor_depos',nor_depos);
        // console.log('cb_act_cd',cb_act_cd);
        // console.log('drcr',drcr);
        // console.log('drcr',amount);
        // console.log('drcr',narration);
        // console.log('drcr',narr_code)
    };




    const handleSelectRow = (rowData) => {
        const { act_name, act_cd, branch_cd, cmp_cd, type_cd } = rowData;
        const newDetails = [...details];
        newDetails[selectedRowIndex].act_name = act_name;
        newDetails[selectedRowIndex].act_cd = act_cd;
        newDetails[selectedRowIndex].branch_cd = branch_cd;
        newDetails[selectedRowIndex].cmp_cd = cmp_cd;
        newDetails[selectedRowIndex].type_cd = type_cd;
        // console.log("accountName", act_name)
        // console.log("act_cd", act_cd)
        // console.log("comp_cd", cmp_cd)
        // console.log("type_cd", type_cd)
        // console.log("branch_cd", branch_cd)
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
        if (!voucherDate || !effectiveDate) {
            alert('Please enter Voucher Date and Effective Date.');
            return;
        }

        setUserId(1);

        const headerData = {
            bookType,
            voucherDate,
            effectiveDate,
            transType,
            userId,
        };
        setHeader(headerData);
        const data = {
            header: headerData,
            details: details,
        };
        alert(JSON.stringify(data));
        var resValidate = calculateTotals(details);
        console.log('resValidate', resValidate)
        if (resValidate == 0) {
            axios.post('http://localhost:3001/voucher', data)
                .then(response => {
                    alert('Voucher saved successfully!');
                    // Reset form state after successful save
                    setBookType('');
                    setVoucherDate('');
                    setEffectiveDate('');
                    setNarration('');
                    setDetails([{ act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', segment: '', exchange: '', noraml_deposit: '', narration: '', analyzer_code: '' }]);
                    setTotals({ drTotal: 0, crTotal: 0, balance: 0 });
                })
                .catch(error => console.error('Error saving voucher:', error));

        }
        else {
            alert('The difference between the two values is non-zero. Exiting without saving.');
        }
    };

    const calculateTotals = (data) => {
        const drTotal = data
            .filter((item) => item.dr_cr === 'Dr')
            .reduce((sum, item) => sum + parseFloat(item.dr_amount), 0);
        const crTotal = data
            .filter((item) => item.dr_cr === 'Cr')
            .reduce((sum, item) => sum + parseFloat(item.cr_amount), 0);
        const balance = drTotal - crTotal;
        setTotals({ drTotal, crTotal, balance });

        const difference = Math.abs(balance);
        console.log('dr', drTotal);
        console.log('cr', crTotal);
        console.log('total', balance);
        return difference;

        // Add your save logic here
        //alert('Values are equal. Saving data...');
    };

    const columns = [
        {
            name: 'Index',
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: 'Segment',
            selector: row => row.segment,
            cell: (row, index) => (
                <select
                    value={row.segment}
                    onChange={e => handleInputChange(index, 'segment', e.target.value)}
                    className="form-control">
                    <option value="">Select Segment</option>
                    <option value="C">Cash Market</option>
                    {/* <option value="2">Segment 2</option> */}
                    {/* Add more options as needed */}
                </select>
            ),
            width: '180px',
        },
        {
            name: 'Exchange',
            selector: row => row.exchange,
            cell: (row, index) => (
                <select
                    value={row.exchange}
                    onChange={e => handleInputChange(index, 'exchange', e.target.value)}
                    className="form-control"
                >
                    <option value="">Select Exchange</option>
                    {exchanges.map(exchange => (
                        <option key={exchange.exc_cd} value={exchange.exc_cd}>{exchange.exc_name}</option>
                    ))}
                </select>
            ),
            width: '180px',
        },
        {
            name: 'Normal/Deposit',
            selector: row => row.noraml_deposit,
            cell: (row, index) => (
                <select
                    value={row.noraml_deposit}
                    onChange={e => handleInputChange(index, 'noraml_deposit', e.target.value)}
                    className="form-control"
                >
                    <option value="">Select Normal/Deposit</option>
                    <option value="N">Normal</option>
                    <option value="D">Deposit</option>
                    {/* Add more options as needed */}
                </select>
            ),
            width: '230px',
        },
        {
            name: 'Account Name',
            selector: 'act_name',
            sortable: true,
            cell: (row, index) => (
                <div className='d-flex'>
                    <input
                        type="text"
                        value={row.act_name}
                        onChange={e => handleInputChange(index, 'act_name', e.target.value)}
                        className="form-control"

                    />
                    <Button
                        className='btn btn-primary'
                        variant="primary"
                        onClick={() => handleSearchClick(index, row.exchange, row.segment)}
                        style={{ marginLeft: '10px', width: '110px' }}

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
            width: '350px',
        },
        {
            name: 'Dr/Cr',
            selector: (row, index) => (
                <select
                    value={row.dr_cr}
                    onChange={e => handleTypeChange(index, e.target.value)} // Note: Using index here
                    className="form-control"
                >
                    <option value="">Select Dr/Cr</option>
                    <option value="Dr">Dr</option>
                    <option value="Cr">Cr</option>
                </select>
            ),
            width: '100px',
        },
        {
            name: 'Debit Amount',
            selector: row => row.dr_amount,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.dr_amount}
                    onChange={e => handleInputChange(index, 'dr_amount', e.target.value)}
                    className="form-control"
                    disabled={row.dr_cr !== 'Dr'} // Disable if not 'Dr' is selected
                />
            ),
            width: '150px',
        },
        {
            name: 'Credit Amount',
            selector: row => row.cr_amount,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.cr_amount}
                    onChange={e => handleInputChange(index, 'cr_amount', e.target.value)}
                    className="form-control"
                    disabled={row.dr_cr !== 'Cr'} // Disable if not 'Cr' is selected
                />
            ),
            width: '150px',
        },
        {
            name: 'Narration',
            selector: row => row.narration,
            cell: (row, index) => (
                <input
                    type="text"
                    value={row.narration}
                    onChange={e => handleInputChange(index, 'narration', e.target.value)}
                    className="form-control"

                />
            ),
            width: '200px',
        },

        {
            name: 'Analyzer Code',
            selector: row => row.analyzer_code,
            cell: (row, index) => (
                <select
                    value={row.analyzer_code}
                    onChange={e => handleInputChange(index, 'analyzer_code', e.target.value)}
                    className="form-control"
                >
                    <option value="">Select Analyzer Code</option>
                    <option value="1">Code 1</option>
                    <option value="2">Code 2</option>
                    <option value="3">Code 3</option>
                    {/* Add more options as needed */}
                </select>
            ),
            width: '220px',
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
        <div className="container mt-5">
            <div className="card">
                <div className="card-header text-center color_header">
                    <h5>Debit/Credit Notes</h5>
                </div>
                <div className="card-body">
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="bookType" className="form-label label-width">Book Type</label>
                            <select id="bookType" className="form-select  size_input" name='bookType' value={bookType} onChange={(e) => setBookType(e.target.value)}>
                                <option value=" ">Select Book type</option>
                                {bookTypes.map(BookTypes => (
                                    <option key={BookTypes.book_type} value={BookTypes.book_type}>{BookTypes.book_type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="voucherDate" className="form-label label-width input-smaller">Voucher Date </label>
                            <input id="voucherDate" type="date" className="form-control size_input" value={voucherDate} onChange={(e) => setVoucherDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="voucherNo" className="form-label label-width">Voucher No</label>
                            <input id="voucherNo" type="number" className="form-control size_input " value={voucherNo} onChange={(e) => setVoucherNo(e.target.value)} readOnly />
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="effectiveDate" className="form-label label-width input-smaller">Effective Date </label>
                            <input id="effectiveDate" type="date" className="form-control size_input" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col-md-6 mb-3 d-flex">
                           <label htmlFor="transType" className="form-label label-width">Dr/Cr Note</label>
                            {/* <label htmlFor="narration" className="form-label label-width">Narration</label>
                            <input id="narration" type="text" className="form-control " value={narration} onChange={(e) => setNarration(e.target.value)} /> */}
                            <select id="transType" className="form-select  size_input" name='transType' value={transType} onChange={(e) => setTransType(e.target.value)}>
                                  <option value="Dr Note">Debit Note</option>
                                  <option value="Cr Note">Credit Note</option>
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 d-flex  justify-content-end ">
                            <button className="btn  btn-primary me-2" onClick={handleEditClick}>Edit Voucher</button>
                            {showPopup && <EditVoucherPopup onClose={handleClosePopup} onRowSelect={handleVoucharRowSelect} />}
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
                    <div className='d-flex justify-content-around'>
                        <p>Total Dr: {totals.drTotal}</p>
                        <p>Total Cr: {totals.crTotal}</p>
                        <p>Balance: {totals.balance}</p>
                    </div>

                </div>
            </div>

        </div>
    );
};
export default DrCr_Note;
