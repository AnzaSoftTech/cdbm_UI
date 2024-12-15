// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable, { Alignment } from 'react-data-table-component';
import { Modal, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
// import './journal.css'; // Import custom styles
import './common.css';
import axios from 'axios';
import PopupSearch from './popsearch';
import EditVoucherPopup from './EditVoucherPopup.js';
import { BASE_URL } from "../constants";
import searchIcon from './image/search.png';
import deleteIcon from './image/delete.png';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

function Open_Balance({ details, setDetails }) {
    const [bookType, setBookType] = useState('');
    // const [activityCode, setactivityCode] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    // const [activityCodes, setactivityCodes] = useState([]);
    // const [segment, setSegment] = useState();
    // const [normalDeposit, setNormalDeposit] = useState();
    // const [exchangeCode, setExchangeCode] = useState();
    const [exchangess, setExchanges] = useState([]);
    const [exchange, setExchange] = useState();
    const [segments, setSegments] = useState([]);
    const [segment, setSegment] = useState('');
    const [activityCode, setActivityCode] = useState();
    const [activityCodes, setActivityCodes] = useState([]);
    const [normal_deposit, setNormal_deposit] = useState([]);
    const [editMode, setEditMode] = useState('N');
    const [finYear, setFinYear] = useState();


    // const [exchanges, setExchanges] = useState([]);
    // const [accountType, setAccountType] = useState('account');
    const [voucherNo, setVoucherNo] = useState('');
    const [asonDate, setAsOnDate] = useState('');
    const [narration, setNarration] = useState('');
    const [totals, setTotals] = useState({ drTotal: 0, crTotal: 0, balance: 0 });
    const [showModal, setShowModal] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [drCrType, setDrCrType] = useState('');
    const [header, setHeader] = useState({});

    const [userId, setUserId] = useState(1);
    const [addMode, setAddMode] = useState(true);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_exchange`)
            .then(response => setExchanges(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/get_fin_year`)
            .then(response => setFinYear(response.data))
            .catch(error => console.error('Error fetching accounts:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_segment`)
            .then(response => setSegments(response.data))
            .catch(error => console.error('Error fetching Segment:', error));
    }, []);

    // useEffect(() => {
    //     axios.get(`${BASE_URL}/api/getcurrfinyear`)
    //         .then(response => setFinYear(response.data[0].fin_year))
    //         .catch(error => console.error('Error fetching accounts:', error));
    // }, []);

    useState(() => {
        if (details.length === 0) {
            setDetails([{ account_type: 'account', act_cd: '', act_name: '', open_bal_amt: 0, dr_cr: '' }]);
        }
    });

    const handleAddRow = () => {
        setDetails([...details, { account_type: 'account',act_cd: '', act_name: '', open_bal_amt: 0, dr_cr: '' }]);
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

        if (!exchange) {
            alert('Please select Exchange.');
            return;
        }
        if (!segment) {
            alert('Please select Segment.');
            return;
        }

        if (!activityCode) {
            alert('Please select Activity.');
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
        const { act_name, act_cd, branch_cd, cmp_cd, type_cd, account_type } = rowData;
        const newDetails = [...details];
        newDetails[selectedRowIndex].account_type = account_type;
        newDetails[selectedRowIndex].act_name = act_name;
        newDetails[selectedRowIndex].act_cd = act_cd;
        // newDetails[selectedRowIndex].cmp_cd = cmp_cd;
        setDetails(newDetails);
        setShowModal(false);
    };

    const handleTypeChange = (index, type) => {
        const newDetails = [...details];
        newDetails[index].dr_cr = type;
        setDetails(newDetails);
        setDrCrType(type);
    };

    const handleAccTypeChange = (index, type) => {
        const newDetails = [...details];
        newDetails[index].account_type = type;
        newDetails[index].act_name = '';
        newDetails[index].act_cd = '';
        setDetails(newDetails);
        // setDrCrType(type);
    };

    const handleVoucharRowSelect = async (vouchers) => {
        console.log('vouchers----', vouchers); // Check the structure of vouchers here

            setFinYear(vouchers.fin_year);
            setAsOnDate(vouchers.open_bal_amt);
            setExchange(vouchers.exc_cd);
            setSegment(vouchers.segment);
            if (vouchers.segment) {
                setActivityCodes([]);
                await axios.get(`${BASE_URL}/api/ddl_activity_master?p_segment_cd=` + vouchers.segment)
                    .then(response => setActivityCodes(response.data))
                    .catch(error => console.error('Error fetching activity:', error));
            }
            setActivityCode(vouchers.activity_cd);
            setNormal_deposit(vouchers.nor_depos);
            setAsOnDate(vouchers.bal_as_on_date);

            const newDetails = vouchers.act_cd? {
                 account_type: 'account', act_cd: vouchers.act_cd, act_name: vouchers.account_name, open_bal_amt: vouchers.open_bal_amt
                 , dr_cr: vouchers.drcr
            }
            :{
                account_type: 'cb_account', act_cd: vouchers.cb_act_cd, act_name: vouchers.account_name, open_bal_amt: vouchers.open_bal_amt
                 , dr_cr: vouchers.drcr
            };

            console.log('newDetails ', newDetails);


            // Update the state with selected voucher details
            // setVoucherDetails(voucherDetailsList);

            // Update details state
            setDetails([newDetails]);
            console.log('details ', details);
            setAddMode(false);
            setEditMode('Y');




            // const voucherDetailsList = vouchers.map(voucher => {

            //     // Ensure numeric fields are properly converted
            //     const parseAmount = (value) => {
            //         const number = parseFloat(value);
            //         return isNaN(number) ? 0 : number;
            //     };

            //     return {
            //         bookType: voucher.book_type || '',
            //         voucherNo: voucher.voucher_no || 0,
            //         effectiveDate: voucher.trans_date || null,
            //         voucherDate: voucher.eff_date || null,
            //         segment: voucher.segment || '',
            //         exchange: voucher.exc_cd || '',
            //         normal_deposit: voucher.nor_depos || '',
            //         act_name: voucher.act_name || '',
            //         drCr: voucher.drcr || '',
            //         drAmount: voucher.drcr === 'Dr' ? parseAmount(voucher.amount) : 0,
            //         crAmount: voucher.drcr === 'Cr' ? parseAmount(voucher.amount) : 0,
            //         narration: voucher.narration || '',
            //         analyzerCode: voucher.narr_code || '',
            //         finYear: voucher.fin_year || 0,
            //         branchCd: voucher.branch_cd || '',
            //         actCd: voucher.act_cd || '',
            //         cmpCd: voucher.cmp_cd || 0
            //     };
            // });

            // // Format the dates for the first voucher
            // const formattedVoucherDate = formatDate(vouchers[0].trans_date);
            // const formattedEffectiveDate = formatDate(vouchers[0].eff_date);

            
            // const drTotal = newDetails.reduce((sum, item) => item.dr_cr === 'Dr' ? sum + parseFloat(item.dr_amount || 0) : sum, 0);
            // const crTotal = newDetails.reduce((sum, item) => item.dr_cr === 'Cr' ? sum + parseFloat(item.cr_amount || 0) : sum, 0);
            // const balance = Math.abs(drTotal - crTotal);

            // setTotals({ drTotal, crTotal, balance });

            // setShowModal(false);



            // // Log modal state update
            // console.log('Modal Closed');
        // } else {
        //     console.error('Invalid vouchers array:', vouchers);
        //     console.error('Invalid vouchers array:', message);
        // }
    };

    const handleFinalSave = async () => {

        if (!exchange) {
            alert('Please select Exchange.');
            return;
        }
        if (!segment) {
            alert('Please select Segment.');
            return;
        }
        if (!activityCode) {
            alert('Please select Activity.');
            return;
        }
        if (!normal_deposit) {
            alert('Please select Normal/Deposit.');
            return;
        }
        if (!asonDate) {
            alert('Please enter As on Date.');
            return;
        }

        if (details.length === 0) {
            alert('Please add atleast one transaction');
            return;
        }

        for (let i = 0; i < details.length; i++) {
            if (!details[i].act_name) {
                alert('Please Enter Account Name.');
                return;
            }
            if (!details[i].dr_cr) {
                alert('Please Select Dr/Cr.');
                return;
            }
            if (details[i].dr_cr === 'Cr') {
                if (details[i].cr_amount <= 0) {
                    alert('Cr amount should be greater than 0.');
                    return;
                }
            }
            else if (details[i].dr_cr === 'Dr') {
                if (details[i].dr_amount <= 0) {
                    alert('Dr amount should be greater than 0.');
                    return;
                }
            }
        }

        let dupFlag = 0;
        let tempActName = '';

        for (let i = 0; i < details.length; i++) {
            for (let j = i + 1; j < details.length; j++) {
                if (details[i].act_name === details[j].act_name && details[i].account_type === details[j].account_type) {
                    dupFlag = 1;
                    tempActName = details[i].act_name;
                    break;
                }
            }
            if(dupFlag === 1){
                break;
            }
        }

        if (dupFlag === 1) {
            alert(`Can not select dupilicate Account Name: ${tempActName}`);
            return;
        }

        const isConfirmed = window.confirm('Sure, you want to save?');
        if(!isConfirmed){
            return;
        }

        const valFinYear = (await axios.get(`${BASE_URL}/api/val_fin_year`, { params: { finYear } })).data;
        console.log('valFinYear ', valFinYear);
        if(!valFinYear){
            alert('Entered Fin Year does not exists');
            return;
        }

        // setUserId(1);

        const headerData = {
            activityCode,
            segment,
            normal_deposit,
            exchange,
            finYear,
            asonDate,
            userId,
            editMode,
        };
        setHeader(headerData);
        const data = {
            header: headerData,
            details: details,
        };
        // alert(JSON.stringify(data));

        if (editMode === 'N') {
            const isAccExists = (await axios.get(`${BASE_URL}/api/validate_account`, { params: { data } })).data;
            if (isAccExists) {
                alert('For fin year ' + finYear + ', account ' + isAccExists + ' is already exists');
                return;
            }
        }
        

        await axios.post(`${BASE_URL}/api/save_open_bal`, data)
            .then(response => {
                alert('Open Balance saved successfully');
                // Reset form state after successful save
                // setFinYear('');
                setAsOnDate('');
                // setVoucherDate('');
                setVoucherNo('');
                // setEffectiveDate('');
                setExchange('');
                setSegment('');
                setActivityCode('');
                setNormal_deposit('');
                setDetails([{ account_type: 'account', act_cd: '', act_name: '', open_bal_amt: 0, dr_cr: '' }]);
                setTotals({ drTotal: 0, crTotal: 0, balance: 0 });
                setAddMode(true);
                setEditMode('N');
                setActivityCodes([]);
            })
            .catch(error => console.error('Error saving Opening Balance:', error));

    };

    const handleAdd = () => {
        setAddMode(false);
        setEditMode('N');
    }

    const handleSegment = async (p_Segment) => {
        try {
            setSegment(p_Segment);
            if (p_Segment) {
                setActivityCodes([]);
                await axios.get(`${BASE_URL}/api/ddl_activity_master?p_segment_cd=` + p_Segment)
                    .then(response => setActivityCodes(response.data))
                    .catch(error => console.error('Error fetching activity:', error));
            }
            else {
                setActivityCodes([]);
            }
        }
        catch (error) {
            console.error("Error in Account Type Selection! ", error);
        }
    }

    const handleClear = () => {

        const isCleared = window.confirm('Sure, you want to clear?');
        
        if (!isCleared) {
            return;
        }

        // setFinYear('');
        setAsOnDate('');
        // setVoucherDate('');
        setVoucherNo('');
        // setEffectiveDate('');
        setExchange('');
        setSegment('');
        setActivityCode('');
        setNormal_deposit('');
        setDetails([{ account_type: 'account', act_cd: '', act_name: '', open_bal_amt: 0, dr_cr: '' }]);
        setTotals({ drTotal: 0, crTotal: 0, balance: 0 });
        setAddMode(true);
        setEditMode('N');
        setActivityCodes([]);
    }

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
            name: 'Account Type',
            selector: row => row.account_type,
            cell: (row, index) => (
                <select
                    value={row.account_type}
                    onChange={e => handleAccTypeChange(index, e.target.value)}
                    className="form-control"
                    disabled={editMode === 'Y' ? true : false}
                >
                    <option value="account">Account</option>
                    <option value="cb_account">Cash/Bank</option>
                </select>
            ),
            width: '10.5rem',
        },
        {
            name: 'Account Name/ Cash/Bank Name',
            selector: 'act_name',
            sortable: false,
            cell: (row, index) => (
                <div className='d-flex align-items-center'>
                    <input
                        type="text"
                        value={row.act_name}
                        readOnly
                        onChange={e => handleInputChange(index, 'act_name', e.target.value)}
                        className="form-control"
                        style={{ marginRight: '0.625rem', width: '38rem' }}
                    />
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-search-${index}`}>Search Account</Tooltip>}
                    >
                        <img
                            src={searchIcon}
                            alt="Search"
                            onClick={editMode === 'Y' ? null : () => handleSearchClick(index, exchange, segment)}
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
                                activity = {activityCode}
                                AccountType = {row.account_type}
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
            width: '40.625rem',
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
            width: '10.5rem',
        },
        {
            name: 'Opening Balanace',
            select: row => row.open_bal_amt,
            cell: (row, index) => (
                // <input type="text" value={row.open_bal_amt} className="form-control"/>
                <input type="number" value={row.open_bal_amt} className="form-control" style={{ textAlign: 'right', color: '#0275d8' }}
                    onChange={e => handleInputChange(index, 'open_bal_amt', e.target.value)} />
            ),
            width: '21rem',
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
                            onClick={editMode === 'Y' ? null : () => handleDeleteRow(index)}
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
                    <h5 className="text-center">Opening Balance</h5>
                </div>
                <div className="card-body">
                    {/* <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="accountType" className="form-label form-label-jv label-color-common">Account Type</label>
                            <input id="account" type="radio" name='accountType' value='account' disabled={addMode} 
                                checked={accountType === 'account' ? true : false} onChange={(e) => setAccountType(e.target.value)} />
                            <label htmlFor="account" style={{marginLeft: '20px', marginRight: '30px'}}>Account</label>
                            <input id="cbAccount" type="radio" name='accountType'  value='cbAccount'
                                disabled={addMode} onChange={(e) => setAccountType(e.target.value)} />
                            <label htmlFor="cbAccount" style={{marginLeft: '20px'}}>Cash/Bank</label>
                        </div>
                    </div> */}
                    <div className="row">
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="finYear" className="form-label form-label-jv label-color-common">Fin Year </label>
                            <input id="finYear" className="form-control form-control-jv" style={{ marginRight: '0.625rem' }} value={finYear}
                                disabled={editMode === 'Y' ? true : addMode} onChange={(e) => setFinYear(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-2 d-flex">
                            <label htmlFor="asonDate" className="form-label form-label-jv label-color-common">As on Date</label>
                            <input id="asonDate" type="date" className="form-control form-control-jv" value={asonDate}
                                disabled={editMode === 'Y' ? false : addMode} onChange={(e) => setAsOnDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="exchange" className="form-label form-label-jv label-color-common">Exchange</label>
                            <select id="exchange" className="form-select form-select-jv" name="exchange" value={exchange}
                                disabled={editMode === 'Y' ? true : addMode} onChange={(e) => setExchange(e.target.value)} >
                                <option value="">Select Exchange</option>
                                {exchangess.map(exchange => (
                                    <option key={exchange.mii_id} value={exchange.mii_id}>
                                        {exchange.mii_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="segment" className="form-label form-label-jv label-color-common">Segment</label>
                            <select id="segment" className="form-select form-select-jv" name="segment" value={segment}
                                disabled={editMode === 'Y' ? true : addMode} onChange={(e) => handleSegment(e.target.value)} >
                                <option value="">Select Segment</option>
                                {segments.map(result => (
                                    <option value={result.seg_code} key={result.seg_code}>{result.seg_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="activityCode" className="form-label form-label-jv label-color-common">Activity Code</label>
                            <select id="activityCode" className="form-select form-select-jv" name='activityCode' value={activityCode}
                                disabled={editMode === 'Y' ? true : addMode} onChange={(e) => setActivityCode(e.target.value)} >
                                <option value="">Select Activity Code</option>
                                {activityCodes.map(Act_Code => (
                                    <option key={Act_Code.activity_cd} value={Act_Code.activity_cd}>{Act_Code.act_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="normal_deposit" className="form-label form-label-jv label-color-common">Normal/Deposit</label>
                            <select id="normal_deposit" className="form-select form-select-jv" name="normal_deposit" value={normal_deposit}
                                disabled={editMode === 'Y' ? true : addMode} onChange={(e) => setNormal_deposit(e.target.value)} >
                                <option value="">Select Normal/Deposit</option>
                                <option value="N">Normal</option>
                                <option value="D">Depositor</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3 d-flex">
                        </div>
                        <div className="col-md-6 mb-3 d-flex justify-content-end" >
                            <button className="btn btn-primary me-2" style={{ width: '9rem' }} disabled={!addMode}
                                onClick={handleAdd}>Add</button>
                            <button className="btn btn-secondary me-2" style={{ width: '9rem' }} disabled={addMode}
                                onClick={handleClear}>Clear</button>
                            <button className="btn btn-primary me-2" style={{ width: '9rem' }} disabled={!addMode}
                                onClick={handleEditClick}>Search</button>
                            {showPopup && <EditVoucherPopup onClose={handleClosePopup} onRowSelect={handleVoucharRowSelect} />}
                            <button className="btn btn-success" style={{ width: '9rem' }} disabled={addMode}
                                onClick={handleFinalSave}>Save</button>
                        </div>
                    </div>
                    <div className="row ">
                        <div className="col">
                            <DataTable columns={columns} customStyles={customStyles} data={details} responsive />
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mb-3 mt-3">
                        <button className="btn btn-success" onClick={handleAddRow} disabled={editMode === 'Y' ? true : false}>Add</button>
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
