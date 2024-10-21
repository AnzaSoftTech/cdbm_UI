// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { Modal, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import './drcr.css'; // Import custom styles
import axios from 'axios';
import PopupSearch from './popsearch';
import EditVoucherPopup from './EditVoucherPopup.js';
import { BASE_URL } from "../constants";
import searchIcon from '../../image/search.png';
import deleteIcon from '../../image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';


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
        axios.get(`${BASE_URL}/api/bookType`)
            .then(response => setBookTypes(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/exchange`)
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
            axios.post(`${BASE_URL}/api/save_dr_cr_note`, data)
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
        // {
        //     name: 'Index',
        //     selector: (row, index) => index + 1,
        //     sortable: true,
        // },
        {
            name: 'Segment',
            selector: row => row.segment,
            cell: (row, index) => (
                <select
                    value={row.segment}
                    onChange={e => handleInputChange(index, 'segment', e.target.value)}
                    className="form-control form-control-dr-cr-1">
                    <option value="">Select Segment</option>
                    <option value="C">Cash Market</option>
                    {/* <option value="2">Segment 2</option> */}
                    {/* Add more options as needed */}
                </select>
            ),
            width: '8rem',
        },
        {
            name: 'Exchange',
            selector: row => row.exchange,
            cell: (row, index) => (
                <select
                    value={row.exchange}
                    onChange={e => handleInputChange(index, 'exchange', e.target.value)}
                    className="form-control form-control-dr-cr-1"
                >
                    <option value="">Select Exchange</option>
                    {exchanges.map(exchange => (
                        <option key={exchange.exc_cd} value={exchange.exc_cd}>{exchange.exc_name}</option>
                    ))}
                </select>
            ),
            width: '8rem',
        },
        {
            name: 'Normal/Deposit',
            selector: row => row.noraml_deposit,
            cell: (row, index) => (
                <select
                    value={row.noraml_deposit}
                    onChange={e => handleInputChange(index, 'noraml_deposit', e.target.value)}
                    className="form-control form-control-dr-cr-1"
                >
                    <option value="">Select Normal/Deposit</option>
                    <option value="N">Normal</option>
                    <option value="D">Deposit</option>
                    {/* Add more options as needed */}
                </select>
            ),
            width: '8rem',
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
                        className="form-control form-control-dr-cr-1"

                    />
                    <OverlayTrigger
                        placement="top" // Position the tooltip above the button
                        overlay={
                            <Tooltip id={`tooltip-search-${index}`}>
                                Search Account
                            </Tooltip>
                        }
                    >
                        <img
                            src={searchIcon}
                            alt="Search"
                            onClick={() => handleSearchClick(index, row.exchange, row.segment)}
                            style={{
                                width: '20px', // Adjust size as needed
                                height: '20px',
                                marginTop: '7px',
                                marginLeft: '2px'
                            }}
                        />
                    </OverlayTrigger>
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
            width: '16rem',
        },
        {
            name: 'Dr/Cr',
            selector: (row, index) => (
                <select
                    value={row.dr_cr}
                    onChange={e => handleTypeChange(index, e.target.value)} // Note: Using index here
                    className="form-control form-control-dr-cr-1"
                >
                    <option value="">Select Dr/Cr</option>
                    <option value="Dr">Dr</option>
                    <option value="Cr">Cr</option>
                </select>
            ),
            width: '5rem',
        },
        {
            name: 'Debit Amount',
            selector: row => row.dr_amount,
            cell: (row, index) => (
                <input
                    type="number"
                    style={{textAlign:'right'}}
                    value={row.dr_amount}
                    onChange={e => handleInputChange(index, 'dr_amount', e.target.value)}
                    className="form-control form-control-dr-cr-1"
                    disabled={row.dr_cr !== 'Dr'} // Disable if not 'Dr' is selected
                />
            ),
            width: '10rem',
        },
        {
            name: 'Credit Amount',
            selector: row => row.cr_amount,
            cell: (row, index) => (
                <input
                    type="number"
                    style={{textAlign:'right'}}
                    value={row.cr_amount}
                    onChange={e => handleInputChange(index, 'cr_amount', e.target.value)}
                    className="form-control form-control-dr-cr-1"
                    disabled={row.dr_cr !== 'Cr'} // Disable if not 'Cr' is selected
                />
            ),
            width: '10rem',
        },

        {
            name: 'Analyzer Code',
            selector: row => row.analyzer_code,
            cell: (row, index) => (
                <select
                    value={row.analyzer_code}
                    onChange={e => handleInputChange(index, 'analyzer_code', e.target.value)}
                    className="form-control form-control-dr-cr-1"
                >
                    <option value="">Select Analyzer Code</option>
                    <option value="1">Code 1</option>
                    <option value="2">Code 2</option>
                    <option value="3">Code 3</option>
                    {/* Add more options as needed */}
                </select>
            ),
            width: '6.25rem',
        },

        {
            name: 'Narration',
            selector: row => row.narration,
            cell: (row, index) => (
                <textarea
                    value={row.narration}
                    onChange={e => handleInputChange(index, 'narration', e.target.value)}
                    className="form-control custom-textarea"
                    rows={3}/>
            ),
            width: '10rem',
        },

        {
            name: '',
            cell: (row, index) => (
                <OverlayTrigger
                    placement="top" // Position the tooltip above the button
                    overlay={
                        <Tooltip id={`tooltip-delete-${index}`}>
                            Delete
                        </Tooltip>
                    }
                >
                    <img
                        src={deleteIcon}
                        alt="Delete"
                        onClick={() => handleDeleteRow(index)}
                        style={{
                            width: '20px', // Adjust size as needed
                            height: '20px',
                            marginTop: '7px',
                            marginLeft: '16px'
                        }}
                    />
                </OverlayTrigger>
            ),
            allowOverflow: true,
            width: '4.125rem',
        },
    ];
    
    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: 'purple',
                backgroundColor: '#99bcef',
                color: 'black',
                fontWeight: 'bold',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                minHeight: '40px',
                paddingLeft: '3px',
                paddingRight: '3px',
            },
        },
        headCells: {
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: 'black',
                paddingLeft: '3px',
                paddingRight: '3px',
                // Hide the border on the last head cell
                '&:last-child': {
                    borderRightStyle: 'none',
                },
            },
        },
        cells: {
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: 'blue',
                paddingLeft: '3px',
                paddingRight: '3px',
                // Hide the border on the last cell
                '&:last-child': {
                    borderRightStyle: 'none',
                },
            },
        },
        rows: {
            style: {
                paddingLeft: '3px',
                paddingRight: '3px',
            },
        },
        actionsHeader: {
            style: {
                borderRightStyle: 'none', // Remove border-right for Actions column header
            },
        },
        actionsCell: {
            style: {
                borderRightStyle: 'none', // Remove border-right for Actions column cells
                paddingLeft: '3px',
                paddingRight: '3px',
            },
        },
    };
    
    return (
        <div className="container-common">
            <div className="card">
                <div className="card-header-css">
                    <h3>Debit/Credit Notes</h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="bookType" className="form-label-dr-cr">Book Type</label>
                            <select
                                id="bookType"
                                className="form-select-dr-cr"
                                name='bookType'
                                value={bookType}
                                onChange={(e) => setBookType(e.target.value)}
                            >
                                <option value="">Select Book type</option>
                                {bookTypes.map(BookTypes => (
                                    <option key={BookTypes.book_type} value={BookTypes.book_type}>
                                        {BookTypes.book_type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="voucherDate" className="form-label-dr-cr">Voucher Date</label>
                            <input
                                id="voucherDate"
                                type="date"
                                className="form-control-dr-cr"
                                value={voucherDate}
                                onChange={(e) => setVoucherDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="voucherNo" className="form-label-dr-cr">Voucher No</label>
                            <input
                                id="voucherNo"
                                type="number"
                                className="form-control-dr-cr"
                                value={voucherNo}
                                onChange={(e) => setVoucherNo(e.target.value)}
                                readOnly
                            />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="effectiveDate" className="form-label-dr-cr">Effective Date</label>
                            <input
                                id="effectiveDate"
                                type="date"
                                className="form-control-dr-cr"
                                value={effectiveDate}
                                onChange={(e) => setEffectiveDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="transType" className="form-label-dr-cr">Dr/Cr Note</label>
                            <select
                                id="transType"
                                className="form-select-dr-cr"
                                name='transType'
                                value={transType}
                                onChange={(e) => setTransType(e.target.value)}
                            >
                                <option value="Dr Note">Debit Note</option>
                                <option value="Cr Note">Credit Note</option>
                            </select>
                        </div>
                        <div className="col-md-6 mb-2 d-flex justify-content-end">
                            <button className="btn btn-primary me-2" style={{ width: '9rem' }} onClick={handleEditClick}>Edit Voucher</button>
                            {showPopup && <EditVoucherPopup onClose={handleClosePopup} onRowSelect={handleVoucharRowSelect} />}
                            <button className="btn btn-success" style={{ width: '9rem' }} onClick={handleFinalSave}>Save</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="container-datatable mt-2">
                            <div className="datatable_dr_cr">
                                <DataTable columns={columns} data={details} customStyles={customStyles} responsive />
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-center align-items-center flex-column mt-4'>
                        <div className='d-flex justify-content-around w-100'>
                            <p className='label-color-common mt-2'>Total Dr: {totals.drTotal}</p>
                            <p className='label-color-common mt-2'>Total Cr: {totals.crTotal}</p>
                            <p className='label-color-common mt-2'>Balance: {totals.balance}</p>
                            <p class><button className="btn btn-success" style={{ width: '7rem' }} onClick={handleAddRow}>Add</button></p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default DrCr_Note;
