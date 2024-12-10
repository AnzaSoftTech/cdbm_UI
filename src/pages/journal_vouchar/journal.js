// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import { Modal, Button } from 'react-bootstrap';
import React, { useState, useEffect, useRef } from 'react';
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
    const [activityCode, setActivityCode] = useState();
    const [activityCodes, setActivityCodes] = useState([]);
    const [addMode, setAddMode] = useState(true);
    const [segments, setSegments] = useState([]);
    const [finYear, setFinYear] = useState();
    const [userId, setUserId] = useState(1);

    const [normal_deposit, setNormal_deposit] = useState([]);
    const [voucherDetails, setVoucherDetails] = useState({
        bookType: '',
        effectiveDate: '',
        voucherDate: '',
        voucherNo: '',
        segment: '',
        exchanges: '',
        normal_deposit: '',
        act_name: '',
        drCr: '',
        drAmount: '',
        crAmount: '',
        narration: '',
        analyzerCode: '',

    });





    useEffect(() => {
        axios.get(`${BASE_URL}/api/bookType`)
            .then(response => setBookTypes(response.data))
            .catch(error => console.error('Error fetching Book Type:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_exchange`)
            .then(response => setExchanges(response.data))
            .catch(error => console.error('Error fetching Exchange:', error));
    }, []);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/ddl_segment`)
            .then(response => setSegments(response.data))
            .catch(error => console.error('Error fetching Segment:', error));
    }, []);

    useState(() => {
        if (details.length === 0) {
            setDetails([{ act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', narration: '', analyzer_code: '' }]);
        }
    });

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
        const temp = details.filter((_, i) => i !== index);
        setDetails(temp);

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
        console.log(temp);
        console.log(details);
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
                    act_name: voucher.act_name || '',
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

            if (vouchers.length > 0) {
                console.log('finyear ',vouchers[0].fin_year);
                setFinYear(vouchers[0].fin_year)
                setBookType(vouchers[0].book_type);
                setEffectiveDate(formattedEffectiveDate);
                setVoucherDate(formattedVoucherDate);
                setVoucherNo(vouchers[0].voucher_no);
                setSegment(vouchers[0].segment);
                setExchange(vouchers[0].exc_cd);
                setActivityCode(vouchers[0].cmp_cd);
                setNormal_deposit(vouchers[0].nor_depos);
            }
            const newDetails = voucherDetailsList.map(details => ({
                act_name: details.act_name,
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


            // Update the state with selected voucher details
            setVoucherDetails(voucherDetailsList);

            // Update details state
            setDetails(newDetails);
            const drTotal = newDetails.reduce((sum, item) => item.dr_cr === 'Dr' ? sum + parseFloat(item.dr_amount || 0) : sum, 0);
            const crTotal = newDetails.reduce((sum, item) => item.dr_cr === 'Cr' ? sum + parseFloat(item.cr_amount || 0) : sum, 0);
            const balance = Math.abs(drTotal - crTotal);

            setTotals({ drTotal, crTotal, balance });

            setShowModal(false);

            setAddMode(false);


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
        console.log("act_name", act_name)
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
    const handleAdd = () => {
        setAddMode(false);
    }
    const handleClear = () => {

        const isCleared = window.confirm('Sure, you want to clear?');
        
        if (!isCleared) {
            return;
        }

        setFinYear('');
        setBookType('');
        setVoucherDate('');
        setVoucherNo('');
        setEffectiveDate('');
        setExchange('');
        setSegment('');
        setActivityCode('');
        setNormal_deposit('');
        setDetails([{ act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', narration: '', analyzer_code: '' }]);
        setTotals({ drTotal: 0, crTotal: 0, balance: 0 });
        setAddMode(true);
        setActivityCodes([]);
    }
    const handleFinalSave = () => {
        if (!voucherDate || !effectiveDate) {
            alert('Please enter Voucher Date and Effective Date.');
            return;
        }
        if (!bookType) {
            alert('Please Select Book Type.');
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
            if (!details[i].narration) {
                alert('Please Enter Narration.');
                return;
            }
            if (!details[i].analyzer_code) {
                alert('Please Select Analyzer Code.');
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
        } // end for : for (let i = 0; i < details.length; i++) 

        let dupFlag = 0;
        let tempActName = '';

        for (let i = 0; i < details.length; i++) {
            for (let j = i + 1; j < details.length; j++) {
                if (details[i].act_name === details[j].act_name) {
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
        
        //changes on 10/12/2024, added userId
        const headerData = {
            finYear,
            bookType,
            voucherDate,
            effectiveDate,
            voucherNo,
            segment,
            exchange,
            activityCode,
            normal_deposit,
            userId,
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

            const isConfirmed = window.confirm('Sure, you want to save?');
            if(!isConfirmed){
                return;
            }

            axios.post(`${BASE_URL}/api/save_journal_voucher`, data)
                .then(response => {
                    alert('Voucher saved successfully!');
                    setFinYear('');
                    setBookType('');
                    setVoucherDate('');
                    setEffectiveDate('');
                    setNarration('');
                    setVoucherNo('');
                    setSegment('');
                    setExchange('');
                    setActivityCode('');
                    setNormal_deposit('');
                    setDetails([{ act_name: '', cr_amount: '', dr_amount: '', dr_cr: '', narration: '', analyzer_code: '' }]);
                    setTotals({ drTotal: 0, crTotal: 0, balance: 0 });
                    setAddMode(true);
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
        {
            name: 'Account Name',
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
                    <h5 className="text-center">Journal Voucher</h5>
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
                                disabled={voucherNo ? true : addMode}
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
                                disabled={addMode}
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
                                disabled={addMode}
                                onChange={(e) => setEffectiveDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row">
                        {/* Segment, Exchange, and Normal/Deposit */}
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="exchange" className="form-label form-label-jv label-color-common">Exchange</label>
                            <select
                                id="exchange"
                                className="form-select form-select-jv"
                                name="exchange"
                                value={exchange}
                                disabled={voucherNo ? true : addMode}
                                onChange={(e) => setExchange(e.target.value)}
                            >
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
                            <select
                                id="segment"
                                className="form-select form-select-jv"
                                name="segment"
                                value={segment}
                                disabled={voucherNo ? true : addMode}
                                onChange={(e) => handleSegment(e.target.value)}
                            >
                                <option value="">Select Segment</option>
                                {segments.map(result => (
                                    <option value={result.seg_code} key={result.seg_code}>{result.seg_name}</option>
                                ))}  
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 d-flex">
                            <label htmlFor="activityCode" className="form-label form-label-jv label-color-common">Activity Code</label>
                            <select
                                id="activityCode"
                                className="form-select form-select-jv"
                                name='activityCode'
                                value={activityCode}
                                disabled={voucherNo ? true : addMode}
                                onChange={(e) => setActivityCode(e.target.value)} 
                            >
                                <option value=" ">Select Activity Code</option>
                                {activityCodes.map(Act_Code => (
                                    <option key={Act_Code.activity_cd} value={Act_Code.activity_cd}>{Act_Code.act_name}</option>
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
                                disabled={voucherNo ? true : addMode}
                                onChange={(e) => setNormal_deposit(e.target.value)}
                            >
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
                                onClick={handleEditClick}>Search Voucher</button>
                            {showPopup && <EditVoucherPopup onClose={handleClosePopup} onRowSelect={handleVoucharRowSelect} />}
                            <button className="btn btn-success" style={{ width: '9rem' }} disabled={addMode}
                                onClick={handleFinalSave}>Save</button>
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
                            <button className="btn btn-warning" style={{ width: '7rem' }} onClick={handleAddRow}>Add Row</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Journal;
