// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { Modal, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PopupSearch from './popsearch';
import EditVoucherPopup from './EditVoucherPopup.js';
import searchIcon from './image/search.png';
import deleteIcon from './image/delete.png';
import './common.css';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { BASE_URL } from "../constants";

function Journal({ details, setDetails }) {
    const [bookType, setBookType] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [bookTypes, setBookTypes] = useState([]);
    const [exchangess, setExchanges] = useState([]);
    const [exchange, setExchange] = useState();
    const [voucherDate, setVoucherDate] = useState('');
    const [voucherNo, setVoucherNo] = useState('');
    const [effectiveDate, setEffectiveDate] = useState('');
    const [narration, setNarration] = useState('');
    const [totals, setTotals] = useState({ drTotal: 0, crTotal: 0, balance: 0 });
    const [showModal, setShowModal] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [drCrType, setDrCrType] = useState('');
    const [header, setHeader] = useState({});
    const [segment, setSegment] = useState('');
    //const [segments, setSegments] = useState([]);
    const [normal_deposit, setNormal_deposit] = useState([]);
    const [voucherDetails, setVoucherDetails] = useState({
        bookType: '',
        effectiveDate: '',
        voucherDate: '',
        voucherNo: '',
        segment: '',
        exchanges: '',
        normal_deposit: '',
        accountName: '',
        drCr: '',
        drAmount: '',
        crAmount: '',
        narration: '',
        analyzerCode: '',

    });

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
            setDetails([{ act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', narration: '', analyzer_code: '' }]);
        }
    });

    const handleAddRow = () => {
        setDetails([...details, { act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', narration: '', analyzer_code: '' }]);
    };

    const handleEditClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    // Function to format number with commas
    const formatNumber = (num) => {
        if (!num && num !== 0) return '';
        const [integer, decimal] = num.toString().split('.');
        return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (decimal ? `.${decimal}` : '');
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

    console.log('outside segment ', segment);

    const handleSearchClick = (index, segment, exchange) => {
        console.log('segment ', segment);
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
    const formatDate = (isoString) => {
        if (!isoString) return ''; // Return empty string if input is empty or undefined
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return ''; // Return empty string if date is invalid
        return date.toISOString().split('T')[0]; // Formats as YYYY-MM-DD
    };



    const handleVoucharRowSelect = (vouchers) => {
        console.log('vouchers----', vouchers); // Check the structure of vouchers here

        // Ensure vouchers is an array
        if (Array.isArray(vouchers)) {
            const voucherDetailsList = vouchers.map(voucher => {
                console.log('Processing voucher:', voucher);

                // Ensure numeric fields are properly converted
                const parseAmount = (value) => {
                    const number = parseFloat(value);
                    return isNaN(number) ? 0 : number;
                };

                return {
                    bookType: voucher.book_type || '',
                    voucherNo: voucher.voucher_no || 0,
                    effectiveDate: voucher.trans_date || null,
                    voucherDate: voucher.eff_date || null,
                    segment: voucher.segment || '',
                    exchange: voucher.exc_cd || '',
                    normal_deposit: voucher.nor_depos || '',
                    accountName: voucher.act_name || '',
                    drCr: voucher.drcr || '',
                    drAmount: voucher.drcr === 'Dr' ? parseAmount(voucher.amount) : 0,
                    crAmount: voucher.drcr === 'Cr' ? parseAmount(voucher.amount) : 0,
                    narration: voucher.narration || '',
                    analyzerCode: voucher.narr_code || '',
                    finYear: voucher.fin_year || 0,
                    branchCd: voucher.branch_cd || '',
                    actCd: voucher.act_cd || '',
                    cmpCd: voucher.cmp_cd || 0
                };
            });

            // Format the dates for the first voucher
            const formattedVoucherDate = formatDate(vouchers[0].trans_date);
            const formattedEffectiveDate = formatDate(vouchers[0].eff_date);

            console.log('start', formattedVoucherDate);
            console.log('end', formattedEffectiveDate);

            console.log('Voucher Details List:', voucherDetailsList);

            if (vouchers.length > 0) {
                setBookType(vouchers[0].book_type);
                setEffectiveDate(formattedEffectiveDate);
                setVoucherDate(formattedVoucherDate);
                setVoucherNo(vouchers[0].voucher_no);
                setSegment(vouchers[0].segment);
                setExchange(vouchers[0].exc_cd);
                setNormal_deposit(vouchers[0].nor_depos);
            }
            const newDetails = voucherDetailsList.map(details => ({
                act_name: details.accountName,
                dr_cr: details.drCr,
                dr_amount: details.drAmount,
                cr_amount: details.crAmount,
                // segment: details.segment,
                // exchange: details.exchange,
                // normal_deposit: details.nor_depos,
                narration: details.narration,
                analyzer_code: details.analyzerCode,
                fin_year: details.finYear,
                branch_cd: details.branchCd,
                act_cd: details.actCd,
                cmp_cd: details.cmpCd
            }));

            // Log the new details array
            console.log('New Details Array:', newDetails);
            console.log('Deposit:',normal_deposit)

            // Update the state with selected voucher details
            setVoucherDetails(voucherDetailsList);

            // Update details state
            setDetails(newDetails);

            setShowModal(false);

            // Log modal state update
            console.log('Modal Closed');
        } else {
            console.error('Invalid vouchers array:', vouchers);
        }
    };




    const handleSelectRow = (rowData) => {
        const { act_name, act_cd, branch_cd, cmp_cd, type_cd } = rowData;
        console.log("hiii-----", rowData);
        const newDetails = [...details];
        newDetails[selectedRowIndex].act_name = act_name;
        newDetails[selectedRowIndex].act_cd = act_cd;
        newDetails[selectedRowIndex].branch_cd = branch_cd;
        newDetails[selectedRowIndex].cmp_cd = cmp_cd;
        newDetails[selectedRowIndex].type_cd = type_cd;
        console.log("accountName", act_name)
        console.log("act_cd", act_cd)
        console.log("comp_cd", cmp_cd)
        console.log("type_cd", type_cd)
        console.log("branch_cd", branch_cd)
        setDetails(newDetails);
        setShowModal(false);
    };
    const handleTypeChange = (index, type) => {
        const newDetails = [...details];
        newDetails[index].dr_cr = type;
        if (type === 'Dr') {
            newDetails[index].cr_amount = '';
        } else if (type === 'Cr') {
            newDetails[index].dr_amount = '';
        }
        setDetails(newDetails);
        setDrCrType(type);
    };
    const handleFinalSave = () => {
        if (!voucherDate || !effectiveDate) {
            alert('Please enter Voucher Date and Effective Date.');
            return;
        }
        if (!bookType) {
            alert('Please Select Book Type.');
            return;
        }

        const headerData = {
            bookType,
            voucherDate,
            effectiveDate,
            voucherNo,
            segment,
            exchange,
            normal_deposit,
            // Ayaan : add segment, exc and normal
        };
        setHeader(headerData);
        const data = {
            header: headerData,
            details: details,
        };
       // alert(JSON.stringify(data));
        var resValidate = calculateTotals(details);
       // console.log('resValidate', resValidate)
        if (resValidate == 0) {
            axios.post(`${BASE_URL}/api/save_journal_voucher`, data)
                .then(response => {
                    alert('Voucher saved successfully!');
                    setBookType('');
                    setVoucherDate('');
                    setEffectiveDate('');
                    setNarration('');
                    setVoucherNo('');
                    setSegment('');
                    setExchange('');
                    setNormal_deposit('');
                    setDetails([{ act_name: '', cr_amount: '', dr_amount: '', dr_cr: '',  narration: '', analyzer_code: '' }]);
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
    };



    const columns = [
        // {
        //     name: 'Sr No.',
        //     selector: (row, index) => index + 1,
        //     sortable: false,
        // },

        // {
        //     name: 'Segment',
        //     selector: row => row.segment,
        //     cell: (row, index) => (
        //         <select
        //             value={row.segment}
        //             onChange={e => handleInputChange(index, 'segment', e.target.value)}
        //             className="form-control" 
        //         >
        //             <option value="">Select Segment</option>
        //             <option value="C">Segment 1</option>
        //             <option value="2">Segment 2</option>
        //             {/* Add more options as needed */}
        //         </select>
        //     ),
        //     width: '100px',
        // },
        // {
        //     name: 'Exchange',
        //     selector: row => row.exchange,
        //     cell: (row, index) => (
        //         <select
        //             value={row.exchange}
        //             onChange={e => handleInputChange(index, 'exchange', e.target.value)}
        //             className="form-control" 
        //         >
        //             <option value="">Select Exchange</option>
        //             {exchange.map(exchange => (
        //                 <option key={exchange.exc_cd} value={exchange.exc_cd}>{exchange.exc_name}</option>
        //             ))}
        //         </select>
        //     ),
        //     width: '100px',
        // },
        // {
        //     name: 'Normal/Deposit',
        //     selector: row => row.normal_deposit,
        //     cell: (row, index) => (
        //         <select
        //             value={row.normal_deposit}
        //             onChange={e => handleInputChange(index, 'normal_deposit', e.target.value)}
        //             className="form-control select_color" 
        //         >
        //             <option value="">Select Normal/Deposit</option>
        //             <option value="N">Normal</option>
        //             <option value="D">Depositor</option>
        //             {/* Add more options as needed */}
        //         </select>
        //     ),
        //     width: '100px',
        // },
        {
            name: 'Account Name',
            selector: 'act_name',
            sortable: false,
            cell: (row, index) => (
                <div className='d-flex align-items-center'>
                    <input
                        type="text"
                        value={row.act_name}
                        onChange={e => handleInputChange(index, 'act_name', e.target.value)}
                        className="form-control"
                        style={{ marginRight: '0.625rem' }}
                    />
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-search-${index}`}>Search Account</Tooltip>}
                    >
                        <img
                            src={searchIcon}
                            alt="Search"
                            onClick={() => handleSearchClick(index, exchange, segment)}
                            style={{
                                width: '1.25rem', // Adjust size as needed
                                height: '1.25rem',
                                cursor: 'pointer'
                            }}
                        />
                    </OverlayTrigger>
                    <Modal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        className="custom-modal"
                    >
                        <Modal.Header
                            style={{ backgroundColor: '#0275d8', color: 'white' }}
                            closeButton
                        >
                            <Modal.Title>Search and Select Account</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <PopupSearch
                                onSelectRow={handleSelectRow}
                                exchange={exchange}
                                segment={segment}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            ),
            width: '15.625rem',
        },
        {
            name: 'Dr/Cr',
            selector: row => row.dr_cr,
            cell: (row, index) => (
                <select
                    value={row.dr_cr}
                    onChange={e => handleTypeChange(index, e.target.value)}
                    className="form-control"
                >
                    <option value="">Select Dr/Cr</option>
                    <option value="Dr">Dr</option>
                    <option value="Cr">Cr</option>
                </select>
            ),
            width: '7.5rem',
        },
        {
            name: 'Debit Amount',
            selector: row => row.dr_amount,
            cell: (row, index) => (
                <input
                    type="number"
                    value={row.dr_amount}
                    onChange={e => handleInputChange(index, 'dr_amount', e.target.value)}
                    className="form-control"
                    style={{ textAlign: 'right', color: '#0275d8' }}
                    disabled={row.dr_cr !== 'Dr'}
                />
            ),
            width: '9.375rem',
        },
        {
            name: 'Credit Amount',
            selector: row => row.cr_amount,
            cell: (row, index) => (
                <input
                    type="number"
                    value={row.cr_amount}
                    onChange={e => handleInputChange(index, 'cr_amount', e.target.value)}
                    className="form-control"
                    style={{ textAlign: 'right', color: '#0275d8' }}
                    disabled={row.dr_cr !== 'Cr'}
                />
            ),
            width: '9.375rem',
        },
        {
            name: 'Narration',
            selector: row => row.narration,
            cell: (row, index) => (
                <textarea
                    value={row.narration}
                    onChange={e => handleInputChange(index, 'narration', e.target.value)}
                    className="form-control custom-textarea"
                    rows={3}
                />
            ),
            width: 'auto', // Adjusted for better flexibility
            style: { height: 'auto' }, // Ensures height adjusts based on content
        },
        {
            name: 'Analyzer Code',
            selector: row => row.analyzer_code,
            cell: (row, index) => (
                <select
                    value={row.analyzer_code}
                    onChange={e => handleInputChange(index, 'analyzer_code', e.target.value)}
                    className="form-control select_color"
                >
                    <option value="">Select Analyzer Code</option>
                    <option value="1">Code 1</option>
                    <option value="2">Code 2</option>
                    <option value="3">Code 3</option>
                </select>
            ),
            width: '13.75rem',
        },
        {
            name: '',
            cell: (row, index) => (
                <div className='d-flex justify-content-center align-items-center' style={{ width: '100%', height: '100%' }}>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-delete-${index}`}>Delete Account</Tooltip>}
                    >
                        <img
                            src={deleteIcon}
                            alt="Delete"
                            onClick={() => handleDeleteRow(index)}
                            style={{
                                width: '1.25rem', // Adjust size as needed
                                height: '1.25rem',
                                cursor: 'pointer'
                            }}
                        />
                    </OverlayTrigger>
                </div>
            ),
            allowOverflow: true,
            width: '3.438rem',
            style: { padding: '0', margin: '0', borderRight: 'none' }, // Ensures no padding/margin/border
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
                backgroundColor: '#b8cdeb',
                color: 'black',
                fontWeight: 'bold',
                // fontSize: '10px',
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
                paddingRight: '3px', // Adjust padding as needed
                // Include other styles as needed
            },
        },
        cells: {
            style: {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: 'blue',
                paddingLeft: '3px',
                paddingRight: '3px', // Adjust padding as needed
                // Include other styles as needed
            },
        },
        rows: {
            style: {
                paddingLeft: '3px',
                paddingRight: '3px', // Adjust padding as needed
                // Include other styles as needed
            },
        },
        actionsHeader: {
            style: {
                borderRightStyle: 'none', // Remove border-right for Actions column header
            },
        },
        // Specific styles for Actions column cells
        actionsCell: {
            style: {
                borderRightStyle: 'none', // Remove border-right for Actions column cells
                paddingLeft: '3px',
                paddingRight: '3px', // Ensure padding remains consistent
            },
        },
    };


    return (
        <div className="container-common">
          <div className="card">
            <div className="card-header-css">
              <h3 className="text-center">Journal Voucher</h3>
            </div>
            <div className="card-body">
              <div className="row">
                {/* Book Type and Voucher Date */}
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="bookType" className="form-label form-label-jv label-color-common">Book Type</label>
                    <select
                      id="bookType"
                      className="form-select form-select-jv"
                      name='bookType'
                      value={bookType}
                      onChange={(e) => setBookType(e.target.value)}
                    >
                      <option value="">Select Book Type</option>
                      {bookTypes.map(bookType => (
                        <option key={bookType.book_type} value={bookType.book_type}>
                          {bookType.book_type}
                        </option>
                      ))}
                    </select>
                </div>
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="voucherDate" className="form-label form-label-jv label-color-common">Voucher Date</label>
                    <input
                      id="voucherDate"
                      type="date"
                      className="form-control form-control-jv"
                      value={voucherDate}
                      onChange={(e) => setVoucherDate(e.target.value)}
                    />
                  </div>
                </div>
    
              <div className="row">
                {/* Voucher No and Effective Date */}
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="voucherNo" className="form-label form-label-jv label-color-common">Voucher No</label>
                    <input
                      id="voucherNo"
                      type="number"
                      className="form-control form-control-jv"
                      value={voucherNo}
                      readOnly
                    />
                </div>
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="effectiveDate" className="form-label form-label-jv label-color-common">Effective Date</label>
                    <input
                      id="effectiveDate"
                      type="date"
                      className="form-control form-control-jv"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                    />
                </div>
              </div>
    
              <div className="row">
                {/* Segment, Exchange, and Normal/Deposit */}
                <div className="col-md-6 mb-2 d-flex">
                    <label htmlFor="segment" className="form-label form-label-jv form-label-jv label-color-common">Segment</label>
                    <select
                      id="segment"
                      className="form-select form-select-jv"
                      name="segment"
                      value={segment}
                      onChange={(e) => setSegment(e.target.value)}
                    >
                      <option value="">Select Segment</option>
                      <option value="C">Cash Market</option>
                    </select>
                </div>
                <div className="col-md-6 mb-3 d-flex">
                    <label htmlFor="exchange" className="form-label form-label-jv label-color-common">Exchange</label>
                    <select
                      id="exchange"
                      className="form-select form-select-jv"
                      name="exchange"
                      value={exchange}
                      onChange={(e) => setExchange(e.target.value)}
                    >
                      <option value="">Select Exchange</option>
                      {exchangess.map(exchange => (
                        <option key={exchange.exc_cd} value={exchange.exc_cd}>
                          {exchange.exc_name}
                        </option>
                      ))}
                    </select>
                </div>
                <div className="col-md-6 mb-3 d-flex">

                    <label htmlFor="normal_deposit" className="form-label form-label-jv label-color-common">Normal/Deposit</label>
                    <select
                      id="normal_deposit"
                      className="form-select form-select-jv"
                      name="normal_deposit"
                      value={normal_deposit}
                      onChange={(e) => setNormal_deposit(e.target.value)}
                    >
                      <option value="">Select Normal/Deposit</option>
                      <option value="N">Normal</option>
                      <option value="D">Depositor</option>
                    </select>
                </div>
                <div className="col-md-6 mb-3 d-flex justify-content-end">
                  <button className="btn btn-primary me-2" style={{width:'9rem'}} onClick={handleEditClick}>Edit Voucher</button>
                  {showPopup && <EditVoucherPopup onClose={handleClosePopup} onRowSelect={handleVoucharRowSelect} />}
                  <button className="btn btn-success" style={{width:'9rem'}} onClick={handleFinalSave}>Save</button>
                </div>
              </div>
    
              <div className="row">
                <div className="col">
                  <DataTable columns={columns} data={details} customStyles={customStyles} responsive />
                </div>
              </div>
    
              
    
                    <div className="d-flex justify-content-evenly mb-3 mt-3 ">
                        {/* <div>
                     <p className="label-color-common">Total Dr: {totals.drTotal}</p>
                  </div>
                  <div>
                     <p className="label-color-common">Total Cr: {totals.crTotal}</p>
                   </div>
                   <div>
                      <p className="label-color-common">Balance: {totals.balance}</p>
                    </div> */}

                        <div>
                            <p>Total Dr: {formatNumber(totals.drTotal)}</p>
                        </div>
                        <div>
                            <p>Total Cr: {formatNumber(totals.crTotal)}</p>
                        </div>
                        <div>
                            <p><b>Balance: {formatNumber(totals.balance)}</b></p>
                        </div>
                        <div className="d-flex">
                            <button className="btn btn-warning" style={{width:'7rem'}} onClick={handleAddRow}>Add Row</button>
                        </div>
                    </div>
              
            </div>
          </div>
        </div>
      );
    };
    
export default Journal;
